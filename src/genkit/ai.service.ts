import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { CategoryEntity } from 'src/products/entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AiService {
  private ai = genkit({
    plugins: [googleAI()],
  });
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async analyzeImage(base64Image: string) {
    try {
      const categoriesDB = await this.categoryRepository.find();
      const validCategories = categoriesDB.map(cat => cat.name.toLowerCase());

      const base64Data = base64Image.includes(',')
        ? base64Image.split(',')[1]
        : base64Image;

      const result = await this.ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: [
          {
            text: `Actúa como un experto senior en Economía Circular, Gestión de Residuos y Sostenibilidad Ambiental. 
                    Tu tarea es analizar la imagen de un objeto que un usuario desea REGALAR en la plataforma.
                    Genera una respuesta estrictamente en formato JSON con los siguientes campos:
                    {
                      "name": "Nombre comercial y descriptivo del objeto (ej: Silla de madera ergonómica)",
                      "description": "Una descripción persuasiva de máximo 20 palabras que resalte el estado del objeto y su potencial de reúso.",
                      "category": "Clasifica el objeto estrictamente en una de estas categorías: ${validCategories.join(', ')}",
                      "ecoImpact": "Un dato técnico breve sobre el beneficio ambiental de regalar este objeto en lugar de desecharlo (ej: ahorro de materias primas, reducción de huella de carbono o ahorro de litros de agua en fabricación)."
                    }

                    LINEAMIENTOS TÉCNICOS:
                    1. Prioriza términos de 'segunda vida' y 'consumo responsable'.
                    2. Si el objeto parece antiguo, resalta su valor 'vintage' o de durabilidad.
                    3. El campo 'ecoImpact' debe ser educativo y motivar al usuario a completar la publicación.
                    `
          },
          {
            media: {
              url: `data:image/jpeg;base64,${base64Data}`,
              contentType: 'image/jpeg'
            }
          },
        ],
        output: { format: 'json' },
      });
      return result.output;
      
    } catch (error: any) {
      throw new InternalServerErrorException('Error iaservice.');
    }
  }
}