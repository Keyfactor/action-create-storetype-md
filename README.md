# Merge json files

This action is designed to merge 2 json files together. Intended to be used for Keyfactor store_types definitionsinpu

## Inputs

### `input-file`

**Required** Integration Manifest with store_types definition (default = integration-manifest.json)

## Outputs

### `time`

For debugging purposes

## Example usage

```yaml
uses: keyfactor/action-create-storetype@v1.0
with:
	input-file: integ-store-types.json
	
```