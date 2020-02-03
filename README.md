# TacticsFoundryApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


https://stackoverflow.com/questions/59531305/call-retries-were-exceeded-exception-while-ng-

The recommended remedy is to:

update node to the latest version e.g. 12.14.0
increase the memory for the build process:
in your package.json change the "build" script to: node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build
in this case the memory is increased to 4GB
depending on the size of your project you may need more
As a quick workaround it could also work to use older versions of angular/cli and build-angular: