import { Module } from '@nestjs/common';
import { MushroomsController } from './mushrooms.controller';
import { MushroomsService } from './mushrooms.service';

@Module({ controllers: [MushroomsController], providers: [MushroomsService], exports: [MushroomsService] })
export class MushroomsModule {}
