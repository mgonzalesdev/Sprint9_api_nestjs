import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importa ambos
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { StatsModule } from './stats/stats.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './genkit/ai.module';

@Module({
  imports: [
    // 1. Cargamos el ConfigModule primero
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Usamos forRootAsync para esperar a que las variables carguen
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    ProductsModule,
    StatsModule,
    AuthModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {


}