import { NOTIFICATIONS_SERVICE } from '@app/common';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get<string>('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    try {
      // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card,
      // });  //  Not advisable to pass in card details from server. To enable this, we need to ask permission from the support team.

      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100,
        confirm: true,
        payment_method_types: ['card'],
        currency: 'inr',
      });

      this.notificationClient.emit('notify_email', {
        email,
        text: `Your payment of Rs.${amount} has been completed`,
      });

      return paymentIntent;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
