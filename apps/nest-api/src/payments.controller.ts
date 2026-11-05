import { Body, Controller, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  @Post('checkout')
  checkout(@Body() body: { priceId: string; quantity?: number }) { return { checkoutId: `demo_${Date.now()}`, priceId: body.priceId, quantity: body.quantity ?? 1, mode: 'sandbox' }; }
}
