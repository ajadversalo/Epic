import { Module } from '@nestjs/common';
import { LabsController } from './labs.controller.js';
import { PaymentsController } from './payments.controller.js';
import { AuthController } from './auth.controller.js';

@Module({ controllers: [LabsController, PaymentsController, AuthController] })
export class AppModule {}
