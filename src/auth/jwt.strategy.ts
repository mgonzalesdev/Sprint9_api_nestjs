import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'CLAVE_TEMPORAL_DE_EMERGENCIA_123' , // Usa variables de (.env)
    });
  }

  // Si el token es válido, este método se ejecuta y el retorno se inyecta en req.user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}