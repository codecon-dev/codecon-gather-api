# 📡 CodeCon-Gather API

An API that interacts with Gather.town API and customizes the user experience on the CodeCon Tech Event!

Test Map: https://app.gather.town/mapmaker/Ixw7EUhrLHlfQwqb/codecon-gather-api-test-1

## How to Develop

```bash
# Copy .env.example to .env
cp .env.example .env

# Set the environment variables on .env
# Get GATHER_API_KEY from https://app.gather.town/apiKeys
# Get GATHER_SPACE_ID_1 from your space URL.
# Eg: 5jnhRfDYRIUyDmbF/my-space

# Install dependencies
npm install

# Run server
npm run dev
```

## Tips

### Finding the event name and payload you wish to use

Go to `node_modules/@gathertown/gather-game-common/src/events.proto` and check `ServerClientEvent` message.  
You might want to add this [extension](https://marketplace.visualstudio.com/items?itemName=zxh404.vscode-proto3) for syntax highlight.  
On VSCode, select the event name such as `MapSetObjects`, press `Ctrl+D` and find its payload.  
You can also `Ctrl+Click` on the payload class names to check their content. In this case, `WireObject`.

### Debugging user space stats

You can use the `logSpaceStatsOnUserMovement` function to log the space stats (steps, online time, etc) for a user on the current date and the current space they are located at.

Usage example:

```js
import { logSpaceStatsOnUserMovement } from "../../utils/debug";
//...

export async function trackSteps(data: PlayerMovesEventData, context: ServerClientEventContext) {
  try {
    const playerId = context?.playerId!
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    logSpaceStatsOnUserMovement(user, friendlySpaceId)
    const playerNewPosition = getPosition(data)
    //...
  } catch (error) {
    console.log(error)
  }
}
```

## References

- [Gather Game Client Docs](http://gather-game-client-docs.s3-website-us-west-2.amazonaws.com/)
- [Gather WebSocket API Documentation](https://gathertown.notion.site/Gather-Websocket-API-bf2d5d4526db412590c3579c36141063)
- [Gather HTTP API Documentation](https://www.notion.so/Gather-HTTP-API-3bbf6c59325f40aca7ef5ce14c677444)
- [The Forest API Interaction Example](https://github.com/gathertown/the-forest)
- [Gather Forum](https://forum.gather.town/c/developers/api-questions/9)
- [Deleted Code References](https://github.com/codecon-dev/codecon-gather-api/commit/484ad215a18b7880eb88d70f6dc79ca4882761da#diff-dc697555e8ec61509edd340ba26f29b4257f08a420ce81a085c1ed9ed1432b56)
