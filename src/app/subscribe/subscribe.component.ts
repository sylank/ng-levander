import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CustomValidator } from '../shared/validators/email.validator';
import { MailChimpService } from '../shared/mail-chimp.service';
import { GoogleAnalyticsConstants } from '../shared/google.analytics.constants';
import { GoogleAnalyticsService } from '../shared/google-analytics.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.pug',
  styleUrls: ['./subscribe.component.sass']
})
export class SubscribeComponent implements OnInit {
  public formName: FormGroup;
  public user = {
    email: '',
    firstName: '',
    lastName: ''
  }

  public showNotification: boolean;

  constructor(private fb: FormBuilder,
    private mailchimpService: MailChimpService,
    private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.formName = this.fb.group({
      email: ['', [Validators.required, CustomValidator.emailValidator]],
      firstName: ['', []],
      lastName: ['', []],
    });
  }

  onSubmit() {
      this.mailchimpService.submitSubscription(this.user).subscribe( result => {
        console.log('success')
        this.showNotification = true
      },
      error => {
        this.showNotification = true
        console.log(error)
      },
      () => {
        this.showNotification = true
        console.log('else')
      });

      this.googleAnalyticsService.eventEmitter(
        GoogleAnalyticsConstants.SUBSCRIBE_TO_NEWSLETTER_EVENT,
        GoogleAnalyticsConstants.TRUE_ACTION,
        '',
        1)
  }

}
