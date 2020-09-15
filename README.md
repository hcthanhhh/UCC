# UCC

# Introduction
Unified Code Count (UCC) is a code metrics tool that allows the user to count physical and logical software lines of code, compare and collect logical differentials between two versions of source code of a software product, and obtain Cyclomatic Complexity results. With the counting capabilities, users can generate the physical, logical SLOC counts, and other sizing information such as comment and keyword counts of the target program. The differencing capabilities allow users to count the number of added/new, deleted, modified, and unmodified logical SLOC of the current version in comparison with the previous version. The Cyclomatic Complexity results are based on McCabe’s research on this metric.

This release supports various languages including *Ada, ASP/ASP.NET, Assembly, Bash, C/C++, C Shell, COBOL, ColdFusion, ColdFusion Script, CSS, C#, DOS Batch, Fortran, HTML, Java, JavaScript, JSP, Makefiles, MATLAB, NeXtMidas, Pascal, Perl, PHP, Python, Ruby, Scala, SQL, VB, VBScript, Verilog, VHDL, XML, and X-Midas*. It also supports physical counting of data files.
### Tech

UCC Backend uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework

And of course UCC itself is open source with a [public repository][ucc] on GitHub.

### Installation
UCC requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd UCC/Backend
$ npm install -d
$ npm run serve
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

### Plugins

UCC is currently extended with the following functions.

| Function | POST |
| ------ | ------ |
| CloneGit | ```api/CloneGit``` |
| UploadProject | ```api/UploadProject``` |
| DeleteGit | ```api/DeleteGit``` |
| UCC API | ``` api/UCCUrlMac ``` |
| Get Info API | ```api/GetInfo ``` |
|| ```api/GetlistFile``` |
|| ```api/GetResultUCC``` |
|| ```api/GetSLOCandSize``` |
|| ```api/GetSLOC``` |
|| ```api/getUserSize``` |
|| ```api/getProjectSize``` |
|| ```api/GetCyclomatic``` |
| UCP API| ```api/CalculateUCP``` |
| COCOMO API| ```api/BasicCocomo``` |
|| ```api/IntermediateCocomo``` |
|| ```api/DetailedCocomo``` |

### Todos

 - Write MORE Tests
 - Add more functions

License
----

MIT

   [ucc]: <https://github.com/hcthanhhh/UCC>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>

