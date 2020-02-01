import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteContext } from '../../model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'game-invite-page',
  templateUrl: './game-invite-page.component.html',
  styleUrls: ['./game-invite-page.component.css']
})
export class GameInvitePageComponent implements OnInit {
  qrdata : string = 'EMPTY'
  gamename : string = 'empty'
  sms : SafeUrl
  email : string
  id : string
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router, private zone: NgZone, private unsafe : DomSanitizer) { }

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.id = data.ctx.id
      this.qrdata = "https://tacticsfoundry.firebaseapp.com/join?id=" + this.id
      let cnt = 0
  
      this.data.coreDB.findId(this.id).forEach( res => {
        if (res.docs && res.docs.length >= 1) {
          this.gamename= res.docs[0]['name']
          this.sms = this.unsafe.bypassSecurityTrustUrl(encodeURI("sms:?body=Please join our game, " + this.gamename + ". Go to " + this.qrdata))
          this.email = encodeURI("mailto:?body=Please join our game, " + this.gamename + ". Go to " + this.qrdata + "&subject=Join " + this.gamename +"&")
        }
      })

    })
  }


  copy() {
    navigator.clipboard.writeText(this.id);
  }

  isMobile() {
      return  window.navigator.userAgent.toLowerCase().includes("mobi");
  }

  onBack() {
    this.router.navigate([".."], { relativeTo: this.route})
  } 
}
