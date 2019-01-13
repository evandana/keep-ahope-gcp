"use strict";

const Parse = require('parse/node');

function updateSchemaOnlyWhenNecessary(existingSchemaData, intendedSchema)
{
  // remove any existing fields from the request.
  Object.getOwnPropertyNames(existingSchemaData.fields).forEach(existingField => { delete intendedSchema._fields[existingField] ; });
  return (Object.getOwnPropertyNames(intendedSchema._fields).length + Object.getOwnPropertyNames(intendedSchema._indexes).length > 0 ) ? 
    intendedSchema.update() : Promise.resolve(existingSchemaData);
}

function setParseSchema (serverConfig) {

  Parse.initialize(serverConfig.appId, null, serverConfig.masterKey);
  Parse.serverURL = serverConfig.serverURL ;
  
/*
  Notes:

  (1) A Parse.Schema only represents data needed to make a request about a Parse Schema.  A better name would be SchemaRequest.
  
  (2) As such, fields added by Parse.Schema.prototype.addField() function and its ilks only represent intention to add/create them, and nothing else.
      For example, the .get() method doesn't change any such "fields" in the Schema object based on the result returned from the Parse server.
  
  (3) Starting from Parse v2, standard Javascript Promise has replaced Parse.Promise, which unfortunately is still used in sample code
      in ParsePlatform documentation as of this writing.
 */
  const contactSchema = new Parse.Schema('contacts');

  contactSchema
    .addString('birthCountry')
    .addString('ethnicity')
    .addString('race')
    .addString('genderIdentity')
    .addString('uid')
    .addDate('dateOfBirth')
    .addDate('firstInjectionAge')
    .addDate('dateOfBirth')
    .addBoolean('hispanic')
    .get()
    .then(existingSchemaData => updateSchemaOnlyWhenNecessary(existingSchemaData, contactSchema))
    .catch(error => ((error.code === Parse.Error.INVALID_CLASS_NAME) ? contactSchema.save() : Promise.reject(error)))

  const eventSchema = new Parse.Schema('event');

  eventSchema
    .addNumber('ageOfFirstInjection')
    .addNumber('numberOfOthersHelping')
    .addNumber('syringesGiven')
    .addNumber('syringesTaken')
    .addString('countryOfBirth')
    .addArray('otherDrugs')
    .addDate('dateOfBirth')
    .addDate('date')
    .addDate('newContactDate')
    .addString('ethnicity')
    .addString('primaryDrug')
    .addString('genderIdentity')
    .addString('hivStatus')
    .addString('hepCStatus')
    .addString('housingStatus')
    .addBoolean('isEnrolled')
    .addBoolean('isInCareForHepC')
    .addBoolean('isInCareForHiv')
    .addBoolean('isOutreach')
    .addBoolean('narcanWasOffered')
    .addBoolean('narcanWasTaken')
    .addBoolean('didOdLastYear')
    .addBoolean('hasHealthInsurance')
    .addBoolean('hispanic')
    .addRelation('uid', 'contacts')
    .get()
    .then(existingSchemaData => updateSchemaOnlyWhenNecessary(existingSchemaData, eventSchema))
    .catch(error => ((error.code === Parse.Error.INVALID_CLASS_NAME) ? eventSchema.save() : Promise.reject(error)))
}

module.exports = setParseSchema;