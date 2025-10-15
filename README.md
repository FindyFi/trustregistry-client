# Trust Registry Client

A simple JavaScript client library for interacting with an OpenID Federation server. This package provides a clean interface for querying trust registries and fetching federation entities.

## Installation

```bash
npm install @findyfi/trustregistry-client
```

## Usage

### Basic Setup

```javascript
import { Client } from '@findyfi/trustregistry-client';

// Initialize the client with your OpenID Federation server URL
const client = new Client('https://your-federation-server.com');
```

### API Methods

#### `list(criteria={})`

Lists entities from the trust registry based on optional search criteria.

```javascript
// List all entities
const allEntities = await client.list();

// List entities with specific criteria
const filteredEntities = await client.list({
  type: 'openid_relying_party',
  status: 'active'
});
```

**Parameters:**

- `criteria` (Object, optional): Search parameters to filter the results

**Returns:** Promise that resolves to an array of matching entities.

**Endpoint:** `GET /list`

#### `fetch(uri)`

Fetches a specific federation entity by its URI.

```javascript
// Fetch a specific entity
const entity = await client.fetch('https://example.com/entity');
```

**Parameters:**

- `uri` (String): The URI of the federation entity to fetch

**Returns:** Promise that resolves to the federation entity data.

**Endpoint:** `GET /fetch?sub={uri}`

#### `resolve(sub, anchor, type=null)`

Resolves federation metadata for a given subject and trust anchor.

```javascript
// Resolve entity metadata
const metadata = await client.resolve(
  'https://example.com/entity',
  'https://trust-anchor.com',
  'openid_relying_party'
);

// Resolve without specifying type
const metadata = await client.resolve(
  'https://example.com/entity',
  'https://trust-anchor.com'
);
```

**Parameters:**

- `sub` (String): The subject URI to resolve
- `anchor` (String): The trust anchor URI
- `type` (String, optional): The entity type to resolve

**Returns:** Promise that resolves to the resolved federation metadata.

**Endpoint:** `GET /resolve?sub={sub}&anchor={anchor}&type={type}`

#### `trustMark(sub, trustMarkId)`

Retrieves a trust mark for a specific entity.

```javascript
// Get a trust mark
const trustMark = await client.trustMark(
  'https://example.com/entity',
  'https://trust-mark-issuer.com/tm1'
);
```

**Parameters:**

- `sub` (String): The subject URI that holds the trust mark
- `trustMarkId` (String): The trust mark identifier

**Returns:** Promise that resolves to the trust mark JWT.

**Endpoint:** `GET /trust-mark?sub={sub}&trust_mark_id={trustMarkId}`

#### `trustMarkStatus(sub, trustMarkId, trustMarkJWT, iat=null)`

Checks the status of a trust mark to verify if it's still valid.

```javascript
// Check trust mark status
const status = await client.trustMarkStatus(
  'https://example.com/entity',
  'https://trust-mark-issuer.com/tm1',
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  1640995200
);
```

**Parameters:**

- `sub` (String): The subject URI that holds the trust mark
- `trustMarkId` (String): The trust mark identifier
- `trustMarkJWT` (String): The trust mark JWT to validate
- `iat` (Number, optional): The issued at timestamp

**Returns:** Promise that resolves to the trust mark status information.

**Endpoint:** `GET /trust-mark-status?sub={sub}&trust_mark_id={trustMarkId}&trust_mark={trustMarkJWT}&iat={iat}`

#### `trustMarkHolders(trustMarkId, sub=null)`

Lists all entities that hold a specific trust mark.

```javascript
// Get all holders of a trust mark
const holders = await client.trustMarkHolders('https://trust-mark-issuer.com/tm1');

// Get trust mark info for a specific entity
const holderInfo = await client.trustMarkHolders(
  'https://trust-mark-issuer.com/tm1',
  'https://example.com/entity'
);
```

**Parameters:**

- `trustMarkId` (String): The trust mark identifier
- `sub` (String, optional): Specific subject URI to check

**Returns:** Promise that resolves to a list of trust mark holders or specific holder information.

**Endpoint:** `GET /trust-mark-list?trust_mark_id={trustMarkId}&sub={sub}`

#### `historicalKeys()`

Retrieves historical keys from the federation.

```javascript
// Get historical keys
const keys = await client.historicalKeys();
```

**Parameters:** None

**Returns:** Promise that resolves to historical key information.

**Endpoint:** `GET /historical-keys`

### Error Handling

The client includes built-in error handling that will log detailed error information and re-throw the error for your application to handle:

```javascript
try {
  const entity = await client.fetch('https://example.com/entity');
  console.log('Entity fetched successfully:', entity);
} catch (error) {
  console.error('Failed to fetch entity:', error.message);
}
```

### Advanced Configuration

You can pass additional options when initializing the client:

```javascript
const client = new Client('https://your-federation-server.com', {
  // Additional options can be added here in future versions
});
```

## API Reference

### Class: OpenIDFederationAPIClient

#### Constructor

```javascript
new OpenIDFederationAPIClient(baseUrl, options)
```

- `baseUrl` (String): Base URL of the OpenID Federation server
- `options` (Object, optional): Configuration options

#### Methods

- `list(criteria)`: List federation entities with optional filtering
- `fetch(uri)`: Fetch a specific federation entity by URI
- `resolve(sub, anchor, type)`: Resolve federation metadata for an entity
- `trustMark(sub, trustMarkId)`: Retrieve a trust mark for an entity
- `trustMarkStatus(sub, trustMarkId, trustMarkJWT, iat)`: Check trust mark validity status
- `trustMarkHolders(trustMarkId, sub)`: List entities holding a specific trust mark
- `historicalKeys()`: Retrieve historical federation keys
- `get(endpoint)`: Generic GET request method
- `post(endpoint, data)`: Generic POST request method
- `request(endpoint, method, data)`: Low-level request method

## Examples

### Listing All Entities

```javascript
import { Client } from '@findyfi/trustregistry-client';

const client = new Client('https://federation.example.com');

async function getAllEntities() {
  try {
    const entities = await client.list();
    console.log('Found entities:', entities.length);
    return entities;
  } catch (error) {
    console.error('Error listing entities:', error);
  }
}
```

### Fetching a Specific Entity

```javascript
import { Client } from '@findyfi/trustregistry-client';

const client = new Client('https://federation.example.com');

async function getEntity(entityUri) {
  try {
    const entity = await client.fetch(entityUri);
    console.log('Entity details:', entity);
    return entity;
  } catch (error) {
    console.error('Error fetching entity:', error);
  }
}

// Usage
getEntity('https://example.com/my-entity');
```

### Filtering Entities

```javascript
import { Client } from '@findyfi/trustregistry-client';

const client = new Client('https://federation.example.com');

async function getRelyingParties() {
  try {
    const relyingParties = await client.list({
      entity_type: 'openid_relying_party'
    });
    console.log('Relying parties:', relyingParties);
    return relyingParties;
  } catch (error) {
    console.error('Error fetching relying parties:', error);
  }
}
```

### Resolving Federation Metadata

```javascript
import { Client } from '@findyfi/trustregistry-client';

const client = new Client('https://federation.example.com');

async function resolveEntity() {
  try {
    const metadata = await client.resolve(
      'https://rp.example.com',
      'https://ta.example.com',
      'openid_relying_party'
    );
    console.log('Resolved metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error resolving entity:', error);
  }
}
```

### Working with Trust Marks

```javascript
import { Client } from '@findyfi/trustregistry-client';

const client = new Client('https://federation.example.com');

async function manageTrustMarks() {
  try {
    // Get a trust mark
    const trustMark = await client.trustMark(
      'https://rp.example.com',
      'https://tm-issuer.com/security-profile-1'
    );
    console.log('Trust mark:', trustMark);

    // Check trust mark status
    const status = await client.trustMarkStatus(
      'https://rp.example.com',
      'https://tm-issuer.com/security-profile-1',
      trustMark,
      Date.now() / 1000
    );
    console.log('Trust mark status:', status);

    // List all holders of this trust mark
    const holders = await client.trustMarkHolders('https://tm-issuer.com/security-profile-1');
    console.log('Trust mark holders:', holders);

  } catch (error) {
    console.error('Error managing trust marks:', error);
  }
}
```

### Retrieving Historical Keys

```javascript
import { Client } from '@findyfi/trustregistry-client';

const client = new Client('https://federation.example.com');

async function getHistoricalKeys() {
  try {
    const keys = await client.historicalKeys();
    console.log('Historical keys:', keys);
    return keys;
  } catch (error) {
    console.error('Error fetching historical keys:', error);
  }
}
```

### Complete Federation Entity Verification Workflow

```javascript
import { Client } from '@findyfi/trustregistry-client';

const client = new Client('https://federation.example.com');

async function verifyFederationEntity(entityUri, trustAnchor) {
  try {
    // 1. Fetch basic entity information
    const entity = await client.fetch(entityUri);
    console.log('Entity info:', entity);

    // 2. Resolve full metadata through trust anchor
    const metadata = await client.resolve(entityUri, trustAnchor);
    console.log('Resolved metadata:', metadata);

    // 3. Check trust marks if entity has any
    if (metadata.trust_marks) {
      for (const tmId of metadata.trust_marks) {
        const trustMark = await client.trustMark(entityUri, tmId);
        console.log(`Trust mark ${tmId}:`, trustMark);

        const status = await client.trustMarkStatus(entityUri, tmId, trustMark);
        console.log(`Trust mark ${tmId} status:`, status);
      }
    }

    return {
      entity,
      metadata,
      verified: true
    };
  } catch (error) {
    console.error('Entity verification failed:', error);
    return {
      verified: false,
      error: error.message
    };
  }
}

// Usage
verifyFederationEntity(
  'https://rp.example.com',
  'https://ta.example.com'
);
```

## Requirements

- Node.js with ES modules support
- Modern browser with fetch API support

## License

Apache-2.0

## Author

Samuel Rinnetmäki <samuel@iki.fi>
