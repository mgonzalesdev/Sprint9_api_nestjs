import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscar usuario por email
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // 2. Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    // 3. Generar el Payload (Datos que van dentro del token)
    /* const payload = {
       sub: user.id,
       email: user.email,
       role: user.role
     };
     return {
       access_token: await this.jwtService.signAsync(payload),
     };*/
    return this.generateToken(user);
  }
  async register(createUserDto: CreateUserDto) {
    // 1. Llamamos al servicio de usuarios para guardar
    const newUser = await this.usersService.create(createUserDto);
    // 2. Generamos el token inmediatamente para el login automático
    return this.generateToken(newUser);
  }
  private async generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role } // Datos para el frontend
    };
  }
}
