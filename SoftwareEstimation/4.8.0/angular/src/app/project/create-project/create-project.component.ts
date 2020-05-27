import { Component, ViewChild, ElementRef, Output, EventEmitter, Injector, Inject, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectInput, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, catchError } from 'rxjs/operators';

import * as _ from "lodash";
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { CreateProjectService } from './create-porject.service';
import { async } from '@angular/core/testing';
@Component({
    moduleId: module.id,
    templateUrl: 'create-project.component.html',
    styleUrls: ['create-project.component.scss'],

})
export class CreateProjectComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector,
        public dialogRef: MatDialogRef<CreateProjectComponent>,
        private _projectService: ProjectServiceProxy,
        @Inject(MAT_DIALOG_DATA) public data: ProjectInput,
        private http: HttpClient,
        private internalService: CreateProjectService
    ) {
        super(injector);
    }
    options: string[] = ["Link", "Input file"]
    ProjectForm: FormGroup
    ngOnInit() {
        // this.ProjectForm = new FormGroup({
        //     'name': new FormControl(this.data.linkURL, [
        //       Validators.required,
        //       Validators.minLength(4),
        //       //forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
        //     ]),
        //     'alterEgo': new FormControl(this.hero.alterEgo),
        //     'power': new FormControl(this.hero.power, Validators.required)
        //   });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

    
    save(): void {

        // this.event.date = moment($('#datetime').val());
        // console.log(this.event.date)

        this._projectService.createWithLink(this.data)

            .subscribe(async() => {
                console.log("this data: ",this.data)
                this.notify.info(this.l('SavedSuccessfully'));

                await this.internalService.Clonegit("1",this.data.title,this.data.linkURL).subscribe((result:any)=>{
                    console.log(result)
                })
                   
                this.close();

            });
    }

    close(): void {

        this.dialogRef.close()
    }
}
