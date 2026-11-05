import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateLabDto, LabsService, UpdateLabDto } from './labs.service.js';

@Controller('labs')
export class LabsController {
  constructor(private readonly labs: LabsService) {}

  @Get()
  list() { return { labs: this.labs.list() }; }

  @Get(':id')
  detail(@Param('id') id: string) { return this.labs.get(id); }

  @Post()
  create(@Body() input: CreateLabDto) { return this.labs.create(input); }

  @Put(':id')
  replace(@Param('id') id: string, @Body() input: CreateLabDto) { return this.labs.update(id, input); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateLabDto) { return this.labs.update(id, input); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.labs.remove(id); }
}
