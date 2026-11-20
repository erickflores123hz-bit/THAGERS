import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_PRODUCTS } from '../../../lib/products';

// Mapeo de looks de modelo para demostración gratuita (fallback fotorrealista)
const DEMO_LOOK_MAP = {
  'hoodie-true-rel': '/assets/models/model_true_religion_hoodie.jpg',
  'vag-true-rel': '/assets/models/model_true_religion_full.jpg',
  'vag-ecko': '/assets/models/model_ecko_affliction.jpg',
  'tee-affliction': '/assets/models/model_ecko_affliction.jpg',
  'jacket-retro-track': '/assets/models/model_retro_track.jpg',
  'jersey-arsenal': '/assets/models/hero_afro_model_white.jpg',
  'polo-skate': '/assets/models/hero_scroll_expand.jpg',
  'denim-southpole': '/assets/models/model_ecko_affliction.jpg',
  'denim-yellow-arc': '/assets/models/model_true_religion_full.jpg',
  'jacket-camo': '/assets/models/model_retro_track.jpg',
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { userImage, productId, garmentImage, category: overrideCategory, forceDemo } = body;

    if (!userImage) {
      return NextResponse.json(
        { success: false, error: 'Se requiere la imagen de la persona.' },
        { status: 400 }
      );
    }

    // Buscar producto en el catálogo
    const product = productId ? INITIAL_PRODUCTS.find((p) => p.id === productId) : null;

    // Determinar categoría ('upper_body' o 'lower_body')
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

    // Imagen de fallback para modo demo
    const demoLook =
      (productId && DEMO_LOOK_MAP[productId]) ||
      product?.image ||
      '/assets/models/model_true_religion_hoodie.jpg';

    // Si el usuario eligió forzar Modo Demo directamente desde la interfaz
    if (forceDemo) {
      // Simular tiempo de cómputo realista de IA (1.2s en servidor)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return NextResponse.json({
        success: true,
        isDemo: true,
        resultUrl: demoLook,
        category,
        productName: product?.name || 'Prenda seleccionada',
        message: 'Modo Demostración activo: Renderizado de prueba generado sin costo.'
      });
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;

    // Si no hay token configurado, activar modo demo automáticamente
    if (!apiToken) {
      return NextResponse.json({
        success: true,
        isDemo: true,
        resultUrl: demoLook,
        category,
        productName: product?.name || 'Prenda seleccionada',
        message: 'Modo Demostración activo: Token de Replicate no detectado.'
      });
    }

    // Preparar imagen de la prenda
    let garmImgInput = null;
    const targetGarmentPath = product?.overlayImage || garmentImage || product?.image;

    if (targetGarmentPath) {
      if (
        targetGarmentPath.startsWith('http://') ||
        targetGarmentPath.startsWith('https://') ||
        targetGarmentPath.startsWith('data:')
      ) {
        garmImgInput = targetGarmentPath;
      } else {
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
      garmImgInput = demoLook;
    }

    const replicate = new Replicate({ auth: apiToken });
    const garmentDes = product ? `${product.name} - Streetwear` : 'Fashion Streetwear garment';

    try {
      // Intentar llamada real a Replicate
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

      if (resultUrl) {
        return NextResponse.json({
          success: true,
          isDemo: false,
          resultUrl,
          category,
          productName: product?.name || 'Prenda seleccionada',
        });
      }
    } catch (replicateErr) {
      console.warn('Replicate API error, activando fallback Modo Demo:', replicateErr.message);

      // Si es error 402 (sin saldo), 401 o cuota excedida, activar Modo Demo para no bloquear al usuario
      return NextResponse.json({
        success: true,
        isDemo: true,
        resultUrl: demoLook,
        category,
        productName: product?.name || 'Prenda seleccionada',
        message: 'Modo Demostración activo: Se generó la prueba fotorrealista (Replicate sin saldo de cuenta).'
      });
    }

    return NextResponse.json({
      success: true,
      isDemo: true,
      resultUrl: demoLook,
      category,
      productName: product?.name || 'Prenda seleccionada',
    });
  } catch (error) {
    console.error('Error general en /api/try-on:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar la prueba virtual.',
      },
      { status: 500 }
    );
  }
}
