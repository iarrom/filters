JavaScript API
Wized offers a JavaScript API to extend your web apps with custom logic, providing access to the following features:

The project configuration.
The Data Store.
The Wized Elements.
Global events.
Request helpers.
Most of these functionalities can be accessed right from inside the Function Editor, but in some cases you might want to use the JavaScript API directly from your own code.

Initialize
The following wrapper will ensure that the Wized API is loaded before executing your code:

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
// Your code goes here
});
The Wized object
Wized.version
Type: string
Returns the current version of the Wized Embed library. This is useful when debugging your app.

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
console.log(Wized.version);
});
Wized.config
Type: WizedConfig
Returns the project configuration that was loaded by Wized. This is useful when debugging your app.

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
console.log(Wized.config);
});
Wized.data
Type: DataStore
Contains your project's Data Store, also known as your app's state.

type DataStore = {
c: Record<string, unknown>;
f: Record<string, RecursiveValue<Record<string, FormFieldValue>>>;
i: Record<string, RecursiveValue<string>>;
v: Record<string, unknown>;
r: Record<string, WizedRequestData>;
n: {
href: string;
path: string;
parameter: Record<string, string>;
};
};

type WizedRequestData = {
id: string;
number: number;
data: unknown; // The response data
headers: Record<string, string>; // The response headers
isRequesting: boolean;
hasRequested: boolean;
statusText: string | null;
status: number | null;
ok: boolean | null;
duration: number;
};
Reading values from the Data Store
You can read any value from the Data Store by simply accessing the Wized.data object properties:

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
console.log(Wized.data.v.my_variable);
console.log(Wized.data.c.my_cookie);
});
Updating values in the Data Store
You can update any value in the Data Store by simply assigning a new value to the Wized.data object properties or mutating them:

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
// Normal assignments
Wized.data.v.my_variable = 'New value';
Wized.data.n.parameter.id = 1234;

// Array updates
Wized.data.v.items.push('New item');
Wized.data.v.items.sort();
Wized.data.v.items = [...Wized.data.v.items, 'Newer item'];

// Nested objects
Wized.data.f.my_form = {
name: 'John',
email: 'john@doe.com',
};
});
Updates to:

Variables (v.my_variable): will trigger any reactivity associated to them. This applies to any other field in the Data Store too.
Cookies (c.my_cookie): will set the new cookie value to the browser. To remove cookies, just set the value to null.
Parameters (n.parameter.my_parameter): will set the new parameter value to the current URL. To remove parameters, just set the value to null.
Inputs (i.my_input): will set the new input value to the input field. Each field expects the correct value type:
Text inputs: string
Number and range inputs: number
Checkboxes: boolean
Checkbox groups: Array<string>
Radio groups: string
Select dropdowns: string
Multi-select dropdowns: Array<string>
Forms (f.my_form): any field of a form can be updated using the field name. The expected value types are the same as Inputs (i).
Update a single field: Wized.data.f.my_form.name = "John"
Update multiple fields: Wized.data.f.my_form = { name: 'John', email: 'john@doe.com' };
Requests (r.my_request): although it’s possible to update requests state using the API, it’s not recommended as it can create conflicts with the native Actions & Requests.
Wized.reactivity.watch()
Watches one or more reactive Data Store values and invokes a callback function when the sources change.

Example:

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
Wized.reactivity.watch(
() => Wized.data.v.my_variable,
(newValue, oldValue) => {
console.log(`my_variable changed from ${oldValue} to ${newValue}`);
}
);
});
Example with multiple values:

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
Wized.reactivity.watch(
[() => Wized.data.v.my_variable, () => Wized.data.v.my_other_variable],
([newVar, newOtherVar], [oldVar, oldOtherVar]) => {
console.log(`my_variable changed from ${oldVar} to ${newVar}`);
console.log(`my_other_variable changed from ${oldOtherVar} to ${newOtherVar}`);
}
);
});
This function is provided by Vue's @vue/reactivity package, the full documentation can be found here.

Wized.reactivity.effect()
Runs a function immediately while reactively tracking any Data Store values and re-runs it whenever those values are changed.

Example:

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
Wized.reactivity.effect(() => {
console.log(Wized.data.v.my_variable);
});
});
This function is provided by Vue's @vue/reactivity package, the full documentation can be found here.

Wized.requests.execute()
Type: (identifier: string) => Promise<WizedRequestData>
The function expects an identifier of the request that can be either the Request ID or the Request name.

Triggers a request and returns a Promise with the WizedRequestData.

Example:

window.Wized = window.Wized || [];
window.Wized.push(async (Wized) => {
const result = await Wized.requests.execute('request_name');
console.log(result);
});
Wized.requests.waitFor()
Type: (identifier: string) => Promise<WizedRequestData>
The function expects an identifier of the request that can be either the Request ID or the Request name.

Returns a Promise that resolves when the request has finished. As opposite to Wized.requests.execute, this method does not execute the request, only awaits for it to finish.

window.Wized = window.Wized || [];
window.Wized.push(async (Wized) => {
const result = await Wized.requests.waitFor('request_name'); // This will not trigger a request execution
console.log(result);
});
Wized.requests.getClient()
Type: (identifier: string) => Promise<WizedClientData>
Warning

This is an advanced feature and should only be used if you know what you are doing.

The function expects an identifier that can be either a Request ID, a Request name, an App ID or an App name.

Returns the client used to execute the request. This is useful when you need to interact with the SDK client directly via custom code.

Currently only Supabase and Firebase clients are supported, and the returned object will be one of the following:

type WizedClientData =
| {
type: 'supabase';
version: string; // The version of the SDK, i.e. "2.39.7"
client: SupabaseClient; // https://supabase.com/docs/reference/javascript/initializing
}
| {
type: 'firebase';
version: string; // The version of the SDK, i.e. "10.8.1"
app: FirebaseApp; // https://firebase.google.com/docs/reference/js/app.firebaseapp.md#firebaseapp_interface}
auth: Auth; // https://firebase.google.com/docs/reference/js/auth.auth.md#auth_interface
firestore: Firestore; // https://firebase.google.com/docs/reference/js/firestore_.firestore.md#firestore_class
storage: FirebaseStorage; // https://firebase.google.com/docs/reference/js/storage.firebasestorage.md#firebasestorage_interface
};
You can use this method to interact with the client like this:

window.Wized = window.Wized || [];
window.Wized.push(async (Wized) => {
const { version, client } = await Wized.requests.getClient('my_supabase_app');

// You should check the client version before using it, as the API might change between versions
if (version.startsWith('2')) {
const user = await client.auth.getUser();
}
});
Notice how in the example above we check the client version before using it. This is an important step because Wized may update the client version in the future, and the API might change between versions.

Important

Wized reserves the right to update client versions without prior notice, it's the developer's responsibility to keep their code prepared for newer versions of the SDKs.

In case you need additional methods from the original npm package, you can use the provided version to dynamically import it:

window.Wized = window.Wized || [];
window.Wized.push(async (Wized) => {
const { version, auth } = await Wized.requests.getClient('my_firebase_app');

// Dynamically import the Firebase package
const firebaseAuth = await import(`https://cdn.jsdelivr.net/npm/firebase@${version}/auth/+esm`);

if (version.startsWith('10')) {
firebaseAuth.signOut(auth);
}
});
Wized.elements.get()
Type: (name: string) => WizedElement
Returns a WizedElement instance by its name. If there are multiple elements with the same name, it will just return the first one.

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
const element = Wized.elements.get('element_name');
});
Wized.elements.getAll()
Type: (name?: string) => WizedElement[]
Returns an array of all the app's WizedElement instances. If a name is provided, it will return all the elements with that name.

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
const elements = Wized.elements.getAll(); // Returns all the elements
const elementsWithName = Wized.elements.getAll('element_name'); // Returns all the elements with the name "element_name"
});
Wized.on()
Type: (eventName: string, listener: (event: Event) => void) => void
Listens for global events of the app. The following events are available:

Wized.on('requeststart', listener)
This event is fired when a request is triggered. The listener callback receives an object with the request name and ID.

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
Wized.on('requeststart', (result) => {
console.log(`Request ${result.name} was triggered`);
});
});
Wized.on('requestend', listener)
This event is fired when a request execution finalizes. The listener callback receives a WizedRequestData object.

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
Wized.on('requestend', (result) => {
console.log(`Request ${result.name} finalized executing after ${result.duration}ms`);
});
});
The WizedElement object
For each element that is defined with a wized = "element_name" HTML attribute in Webflow, Wized creates a WizedElement instance that is used for several purposes:

Store element-specific state.
Store the element's actions and cleanups.
Store the element's node or anchor (when not rendered).
Store the element's clones when applying a Render List action.
Store the element's child tree.
WizedElement.name
Type: string
Returns the element name.

WizedElement.rendered
Type: boolean
Returns true if the element is currently rendered on the page, false otherwise. The rendered state is controlled via the Set Visibility action.

WizedElement.node
Type: Element
Returns the element's DOM node. This is useful when you need to interact with it directly instead of using Wized's actions.

The node is only present in the DOM when the element is rendered.

WizedElement.anchor
Type: Comment
The element's anchor is a placeholder comment that is put in place when the element is not rendered. This is useful when you need to interact with it directly instead of using Wized's actions.

The anchor is only present in the DOM when the element is not rendered.

WizedElement.parent
Type: WizedElement | undefined
Returns the element's parent WizedElement instance, if any.

WizedElement.children
Type: WizedElement[]
Returns an array of the element's child WizedElement instances.

WizedElement.clones
Type: WizedElement[]
Returns an array of the element's clones. Clones are created when applying a Render List action.

WizedElement.data
Type: Record<string, any>
A reactive object used to store element-specific data. This object is shared across all the element's tree (parents and children).

WizedElement.on()
Type: (eventName: string, listener: (event: Event) => void) => void
Adds a lifecycle event listener to the element. The listener will be removed when the element is destroyed.

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
const element = Wized.elements.get('element_name');

element.on('attribute', (event) => {
console.log(`Attribute ${event.key} was updated to ${event.value}`);
});
});
The following events are available:

WizedElement.on("attribute", listener)
This event is fired when the element's attributes are updated via a Set HTML Attribute action.

The listener callback receives the following event object:

event.key: The HTML Attribute key.
event.value: The new value.
WizedElement.on('class', listener)
This event is fired when the element's CSS classes are updated via a Set Class action.

The listener callback receives the following event object:

event.className: The CSS class name.
event.valid: Defines if the class was added or removed.
WizedElement.on('list', listener)
This event is fired when the element's clones are updated via a Render List action.

The listener callback receives the following event object:

event.addedClones: The added element clones.
event.updatedClones: The clones that were kept in the DOM.
event.removedClones: The clones that were destroyed.
WizedElement.on('parameter', listener)
This event is fired when the element's URL parameters are updated via a Set URL Parameter action.

The listener callback receives the following event object:

event.name: The URL parameter name.
event.value: The new value.
WizedElement.on('style', listener)
This event is fired when the element's inline styles are updated via a Set Style action.

The listener callback receives the following event object:

event.style: The style name.
event.value: The new value.
WizedElement.on('text', listener)
This event is fired when the element's text is updated via a Set Text action.

The listener callback receives the following event object:

event.type: The type of update that was made (text, html or markdown).
event.value: The new value.
WizedElement.on('value', listener)
This event is fired when the element's input value is updated via a Set Input Value action.

The listener callback receives the following event object:

event.value: The new value.
WizedElement.on('visibility', listener)
This event is fired when the element's render state is updated via a Set Visibility action.

The listener callback receives the following event object:

event.displayed: Defines if the element was added or removed from the DOM.
