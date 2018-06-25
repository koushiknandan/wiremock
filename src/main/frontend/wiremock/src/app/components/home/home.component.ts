import {Component, HostBinding, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WiremockService} from '../../services/wiremock.service';
import {UtilService} from '../../services/util.service';
import {Message, MessageService, MessageType} from '../message/message.service';
import {RecordSpec} from '../../model/wiremock/record-spec';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DialogRecordingComponent} from '../../dialogs/dialog-recording/dialog-recording.component';
import {SnapshotRecordResult} from '../../model/wiremock/snapshot-record-result';
import {SearchService} from '../../services/search.service';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @HostBinding('class') classes = 'wmHolyGrailBody column';

  isCollapsed = false;

  constructor(private wiremockService: WiremockService, private messageService: MessageService,
              private searchService: SearchService, private modalService: NgbModal,
              private router: Router) {
  }

  ngOnInit() {
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, false);
  }

  resetAll() {
    this.wiremockService.resetAll().subscribe(() => {
      // do nothing
    }, err => {
      UtilService.showErrorMessage(this.messageService, err);
    });
  }

  startRecording() {
    const dialog = this.modalService.open(DialogRecordingComponent);
    dialog.result.then(url => {
      this.actualStartRecording(url);
    }, () => {
      // nothing to do
    });
  }

  private actualStartRecording(url: string): void {
    const recordSpec: RecordSpec = new RecordSpec();
    recordSpec.targetBaseUrl = url;

    this.wiremockService.startRecording(recordSpec).subscribe(() => {
      // do nothing
    }, err => {
      UtilService.showErrorMessage(this.messageService, err);
    });
  }

  stopRecording() {
    this.wiremockService.stopRecording().subscribe(data => {
      // do nothing
      const results = new SnapshotRecordResult().deserialize(data);


      if (UtilService.isDefined(results) && UtilService.isDefined(results.getIds()) && results.getIds().length > 0) {
        const result = results.getIds().join('|');

        this.router.navigate(['/mappings']).then(() => {
          this.searchService.setValue(result);
        }, () => {
          // do nothing
        });
      } else {
        this.messageService.setMessage(new Message('No mappings recorded', MessageType.INFO, 2000));
      }
    }, err => {
      UtilService.showErrorMessage(this.messageService, err);
    });
  }

  snapshot() {
    this.wiremockService.snapshot().subscribe(() => {
      // do nothing
    }, err => {
      UtilService.showErrorMessage(this.messageService, err);
    });
  }

  shutdown() {
    this.wiremockService.shutdown().subscribe(() => {
      // do nothing
    }, err => {
      UtilService.showErrorMessage(this.messageService, err);
    });
  }

}