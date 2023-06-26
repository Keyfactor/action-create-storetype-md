# Create Cert store_type Readme stub

This action will create a new stub files using the integration-manifest.json properties for each store_type defined. This table will be included in the final readme generation

## Inputs

### `input-file`

**Required** Integration Manifest with store_types definition (default = integration-manifest.json)

## Outputs

### `time`

For debugging purposes

## Example usage

```yaml
uses: keyfactor/action-create-storetype-md@v1.0.0
with:
	input-file: integ-store-types.json
	
```