import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    /*JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as any },
    }),*/
        JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Asegúrate de que coincida con el .env
        signOptions: { expiresIn: '15m' },
      }),
    }),
    UsersModule
  ],
  providers: [AuthService, JwtStrategy], // IMPORTANTE: Registrar la estrategia aquí
  exports: [JwtStrategy, PassportModule], controllers: [AuthController]
})
export class AuthModule { 
  
}
