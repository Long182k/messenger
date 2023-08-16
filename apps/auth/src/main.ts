import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  console.log(USER);
  console.log(PASSWORD);
  console.log(HOST);
  console.log(QUEUE);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      // urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      urls: [`amqp://user:password@localhost:5675`],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.startAllMicroservices();
}
bootstrap();
