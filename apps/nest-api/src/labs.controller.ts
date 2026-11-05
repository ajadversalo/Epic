import { Controller, Get, Param } from '@nestjs/common';

@Controller('labs')
export class LabsController {
  @Get()
  list() { return { labs: ['graphql', 'ai-grounding', 'payments', 'grpc', 'authentication'] }; }

  @Get(':slug')
  detail(@Param('slug') slug: string) { return { slug, status: 'ready', endpoint: `/labs/${slug}` }; }
}
