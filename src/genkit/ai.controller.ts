import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  async analyze(@Body('image') image: string) {
    return await this.aiService.analyzeImage(image);
  }
}