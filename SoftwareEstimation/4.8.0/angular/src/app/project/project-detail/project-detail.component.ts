import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectServiceProxy, ProjectDetailOutput } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    moduleId: module.id,
    selector: 'project-detail',
    templateUrl: 'project-detail.component.html',
    styleUrls: ['project-detail.component.scss'],
    animations: [appModuleAnimation()]
})
export class ProjectDetailComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector,
        private _projectService: ProjectServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector)
    }
    show: number = 0
    
    projectId: any
    ngOnInit() {
        this.project = new ProjectDetailOutput()
        this._activatedRoute.params.subscribe((params: Params) => {
            this.projectId = params['projectId'];
            this.loadProject();
            
        });
        
    }
    project:ProjectDetailOutput 
    loadProject(){
        this._projectService.getProjectDetail(this.projectId).subscribe((result:ProjectDetailOutput)=>{
            this.project =result
        })
    }

    toggle(){
        if (this.show ==0 )
        this.show =1
        else this.show =0       
    }
}
