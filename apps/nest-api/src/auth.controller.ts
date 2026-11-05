import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { email: string }) { return { user: { email: body.email }, accessToken: 'demo-token' }; }
}
