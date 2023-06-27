/*
* Build the stub/support file for README.md
* Each store_type defined in the integration-manifest.json will generate a set of tables to be included in the readme build
* This should be run each time the store_types object gets regenerated
 */
const fs = require('fs');
const core = require('@actions/core');

const JSONFILE = process.env.JSONFILE // integration-manifest.json
const STUBFILE = process.env.STUBFILE // readme-src/store-types-tables.md

const checked = 'Checked [x]'
const unchecked = 'Unchecked [ ]'

function buildStoreTypesMD() {
  try {
    const inputFile = core.getInput('input-file') || JSONFILE
    const outputFile = core.getInput('output-file') || STUBFILE
    const newdata = JSON.parse(fs.readFileSync(inputFile))
    var keys = newdata.about.orchestrator.store_types;
    var markdown = '';
    for (const property in keys) {
      const baseRef = keys[property]
      let storeTypeName, CustomAliasAllowed, PrivateKeyAllowed, PFXPasswordStyle, ServerRequired, BlueprintAllowed, PowerShell, StoreRequired, EntrySupported
      var SupportedOperations = baseRef.SupportedOperations;
      storeTypeName = baseRef.Name;
      CustomAliasAllowed = baseRef.CustomAliasAllowed;
      PrivateKeyAllowed = baseRef.PrivateKeyAllowed;
      PFXPasswordStyle = baseRef.PasswordOptions.Style;
      baseRef.StorePathType == '' ? StorePathType = 'Freeform' : StorePathType = baseRef.StorePathType;
      baseRef.ServerRequired ? ServerRequired = checked : ServerRequired = unchecked;
      baseRef.BlueprintAllowed ? BlueprintAllowed = checked : BlueprintAllowed = unchecked;
      baseRef.PowerShell ? PowerShell = checked : PowerShell = unchecked;
      baseRef.PasswordOptions.StoreRequired ? StoreRequired = checked : StoreRequired = unchecked;
      baseRef.PasswordOptions.EntrySupported ? EntrySupported = checked : EntrySupported = unchecked;
      var stn = storeTypeName.toLowerCase();
      const supportedOperationsArray = Object.keys(SupportedOperations)
        .filter(key => SupportedOperations[key])
        .map(key => key);

// Contents of the markdown file with template string replacement
      var markdown = markdown + `
### ${storeTypeName} Store Type
#### kfutil Create ${storeTypeName} Store Type
The following commands can be used with [kfutil](https://github.com/Keyfactor/kfutil). Please refer to the kfutil documentation for more information on how to use the tool to interact w/ Keyfactor Command.

\`\`\`
bash
kfutil login
kfutil store - types create--name ${storeTypeName} 
\`\`\`

#### UI Configuration
##### UI Basic Tab
| Field Name              | Required | Value                                     |
|-------------------------|----------|-------------------------------------------|
| Name                    | &check;  | ${storeTypeName}                          |
| ShortName               | &check;  | ${storeTypeName}                          |
| Custom Capability       |          | Unchecked [ ]                             |
| Supported Job Types     | &check;  | Inventory,${supportedOperationsArray}     |
| Needs Server            | &check;  | ${ServerRequired}                         |
| Blueprint Allowed       |          | ${BlueprintAllowed}                       |
| Uses PowerShell         |          | ${PowerShell}                             |
| Requires Store Password |          | ${StoreRequired}                          |
| Supports Entry Password |          | ${EntrySupported}                         |
      
![${stn}_basic.png](docs%2Fscreenshots%2Fstore_types%2F${stn}_basic.png)

##### UI Advanced Tab
| Field Name            | Required | Value                 |
|-----------------------|----------|-----------------------|
| Store Path Type       |          | ${StorePathType}      |
| Supports Custom Alias |          | ${CustomAliasAllowed} |
| Private Key Handling  |          | ${PrivateKeyAllowed}  |
| PFX Password Style    |          | ${PFXPasswordStyle}   |

![${stn}_advanced.png](docs%2Fscreenshots%2Fstore_types%2F${stn}_advanced.png)

##### UI Custom Fields Tab
| Name           | Display Name         | Type   | Required | Default Value |
|----------------|----------------------|--------|----------|---------------|
| KubeNamespace  | Kube Namespace       | String |          | \`default\`   |
| KubeSecretName | Kube Secret Name     | String | &check;  |               |
| KubeSecretType | Kube Secret Type     | String | &check;  | \`tls_secret\`|

`
    }
//    console.log(markdown);
    fs.writeFile(outputFile, markdown, (err) => {
      if (err)
        console.log(err);
      else {
        console.log(`File written successfully: ${outputFile}`);
      }
    });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}
buildStoreTypesMD();
