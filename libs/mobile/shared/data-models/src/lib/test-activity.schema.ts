// import {
//   toTypedRxJsonSchema,
//   ExtractDocumentTypeFromTypedRxJsonSchema,
//   RxJsonSchema,
//   RxDocument,
//   RxCollection
// } from 'rxdb';
//
// export const testActivitySchemaLiteral = {
//   title: 'test activity schema',
//   description: 'test activity',
//   version: 0,
//   keyCompression: false,
//   primaryKey: 'id',
//   type: 'object',
//   properties: {
//     id: {
//       type: 'string',
//       maxLength: 32 // <- the primary key must have set maxLength
//     },
//     distance: {
//       type: 'number'
//     },
//     duration: {
//       type: 'number'
//     },
//     image: {
//       type: 'string'
//     }
//   },
//   required: ['id']
// } as const; // <- It is important to set 'as const' to preserve the literal type
// const schemaTyped = toTypedRxJsonSchema(testActivitySchemaLiteral);
//
// // aggregate the document type from the schema
// export type TestActivity = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
//
// // create the typed RxJsonSchema from the literal typed object.
// export const testActivitySchema: RxJsonSchema<TestActivity> = testActivitySchemaLiteral;
//
// export type TestActivityDocument = RxDocument<TestActivity>;
//
// export type TestActivityCollection = RxCollection<TestActivity>;
