import { Component, ViewChild, Injector, OnInit } from '@angular/core';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectServiceProxy, ProjectInput, ListResultDtoOfProjectListDto, ProjectListDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MatDialog } from '@angular/material';
import { PagedRequestDto } from '@shared/paged-listing-component-base';

@Component({
    templateUrl: 'project.component.html',
    
    animations: [appModuleAnimation()]
})
export class ProjectComponent implements OnInit {
    @ViewChild('createProjectModal') createProjectModal: CreateProjectComponent;

    constructor(
        injector: Injector,
        private _projectService: ProjectServiceProxy,
        public dialog: MatDialog
    ) {
        //super(injector);
    }
    ngOnInit(){
        this.loadProject()
        
        //")
    }
    project: ProjectInput
    projectList: ProjectListDto[] = [];
    createProject():void {
        this.project = new ProjectInput()
        const dialogRef = this.dialog.open(CreateProjectComponent, {
            width: '550px',
            data: {title: this.project.title, description:this.project.description, type:this.project.type, linkURL:this.project.linkURL}
        });
        dialogRef.afterClosed().subscribe(result => {
            
            console.log(result)
            this.loadProject()
        });
    }
    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loadProject();
        finishedCallback();
    }

    loadProject() {
        this._projectService.getListProject()
            .subscribe((result: ListResultDtoOfProjectListDto) => {
                this.projectList = result.items;
                //console.log("inside: ",this.projectList)
            });
    }
}
