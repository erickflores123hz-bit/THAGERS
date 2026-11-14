import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_PRODUCTS } from '../../../lib/products';

export async function POST(req) {
  try {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { success: false, error: 'Token de Replicate no configurado en el servidor.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { userImage, productId, garmentImage, category: overrideCategory } = body;

    if (!userImage) {
      return NextResponse.json(
        { success: false, error: 'Se requiere la imagen de la persona.' },
        { status: 400 }
      );
    }

    // Buscar producto en el catálogo si se pasó el ID
    const product = productId ? INITIAL_PRODUCTS.find((p) => p.id === productId) : null;

    // Determinar categoría para IDM-VTON ('upper_body', 'lower_body', 'dresses')
    let category = 'upper_body';
    if (overrideCategory) {
      category = overrideCategory;
    } else if (product) {
      if (
        product.overlayType === 'bottom' ||
        product.category === 'vaqueros' ||
        product.category === 'pantalones' ||
        product.subCategory === 'denim'
      ) {
        category = 'lower_body';
      } else {
        category = 'upper_body';
      }
    }

    // Determinar la imagen de la prenda
    let garmImgInput = null;
    const targetGarmentPath = product?.overlayImage || garmentImage || product?.image;

    if (targetGarmentPath) {
      if (targetGarmentPath.startsWith('http://') || targetGarmentPath.startsWith('https://') || targetGarmentPath.startsWith('data:')) {
        garmImgInput = targetGarmentPath;
      } else {
        // Es una ruta local dentro de /public
        const cleanPath = targetGarmentPath.replace(/^\//, '');
        const fullPath = path.join(process.cwd(), 'public', cleanPath);

        if (fs.existsSync(fullPath)) {
          const buffer = await fs.promises.readFile(fullPath);
          const ext = path.extname(fullPath).toLowerCase();
          const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
          garmImgInput = `data:${mime};base64,${buffer.toString('base64')}`;
        }
      }
    }

    if (!garmImgInput) {
      return NextResponse.json(
        { success: false, error: 'No se encontró la imagen de la prenda a probar.' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: apiToken,
    });

    const garmentDes = product ? `${product.name} - Streetwear` : 'Fashion Streetwear garment';

    // Ejecutar modelo IDM-VTON en Replicate
    const output = await replicate.run(
      'cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985',
      {
        input: {
          human_img: userImage,
          garm_img: garmImgInput,
          category: category,
          garment_des: garmentDes,
          crop: true,
          steps: 30,
          seed: 42,
        },
      }
    );

    let resultUrl = '';
    if (typeof output === 'string') {
      resultUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      resultUrl = output[0];
    } else if (output && typeof output === 'object') {
      resultUrl = output.url || output.output || String(output);
    }

    if (!resultUrl) {
      return NextResponse.json(
        { success: false, error: 'El modelo no devolvió una imagen válida.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resultUrl,
      category,
      productName: product?.name || 'Prenda seleccionada',
    });
  } catch (error) {
    console.error('Error en /api/try-on:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Ocurrió un error inesperado al procesar la prueba virtual.',
      },
      { status: 500 }
    );
  }
}
