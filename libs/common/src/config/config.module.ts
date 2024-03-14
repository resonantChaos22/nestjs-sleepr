import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';
//  Abstracting the third party modules

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        // MONGODB_URI: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

// Disabled the validation schema as it was expecting MONGODB_URI in services which dont require MONGODB_URI
