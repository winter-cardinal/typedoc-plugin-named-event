# About

[TypeDoc](http://typedoc.org) plugin to rename events, remove optional flags and
@internal tag for documenting events.

```ts
interface Class {
  /**
   * @event event-name
   * @internal
   */
  listener?( items:IItem[], transaction:Promise<ITransaction> ): void;
}
```

Reasons why the method is marked as an optional and an internal is to allow
* implementation classes to omit a method implementation, and
* type defition files to ignore this method.

# Usage

```sh
npm i -D @winter-cardinal/typedoc-plugin-named-event
```

TypeDoc automatically detects the plugin.
