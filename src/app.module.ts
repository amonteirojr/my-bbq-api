import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BarbecueModule } from './barbecue/barbecue.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantModule } from './participant/participant.module';
import Barbecue from './barbecue/entities/barbecue.entity';
import Participant from './participant/entities/participant.entity';
import { CreateBarbecuesTable1634070535415 } from 'migrations/1634070535415-CreateBarbecuesTable';
import { CreateParticipantsTable1634071634276 } from 'migrations/1634071634276-CreateParticipantsTable';
import { UserModule } from './user/user.module';
import User from './user/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.envConfig.typeormConnection,
        host: configService.envConfig.typeormHost,
        port: configService.envConfig.typeormPort,
        database: configService.envConfig.typeormDatabase,
        username: configService.envConfig.typeormUsername,
        password: configService.envConfig.typeormPassword,
        entities: [Barbecue, Participant, User],
        synchronize: false,
        migrationsRun: true,
        migrations: [
          CreateBarbecuesTable1634070535415,
          CreateParticipantsTable1634071634276,
        ],
      }),
    }),
    BarbecueModule,
    ParticipantModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
