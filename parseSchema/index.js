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
    // fields are listed by type and in alphabetical order.  In dashboard you may move columns around to examine.
    .addArray('otherDrugs')
    .addArray('otherDrugsAggregate')

    .addBoolean('didOdLastYear')
    .addBoolean('hasHealthInsurance')
    .addBoolean('hispanic')
    .addBoolean('isEnrolled')
    .addBoolean('isInCareForHepC')
    .addBoolean('isInCareForHiv')

    .addDate('dateOfBirth')
    .addDate('dateOfLastVisit')
    .addDate('ageOfFirstInjection')

    .addNumber('syringesGivenAggregate')
    .addNumber('syringesTakenAggregate')

    .addString('countryOfBirth')
    .addString('ethnicity')
    .addString('genderIdentity')
    .addString('healthInsurer')
    .addString('hepCStatus')
    .addString('hivStatus')
    .addString('housingStatus')
    .addString('primaryDrug')
    .addString('profileNotes')
    .addString('uid')    
    .addString('zipCode')

    .get()
    .then(existingSchemaData => updateSchemaOnlyWhenNecessary(existingSchemaData, contactSchema))
    .catch(error => ((error.code === Parse.Error.INVALID_CLASS_NAME) ? contactSchema.save() : Promise.reject(error)))

  const eventSchema = new Parse.Schema('event');

  eventSchema
    // fields are listed by type and in alphabetical order.  In dashboard you may move columns around to examine.
    .addArray('otherDrugs')
    .addArray('referrals')

    .addBoolean('didOdLastYear')
    .addBoolean('hasHealthInsurance')
    .addBoolean('hispanic')
    .addBoolean('isEnrolled')
    .addBoolean('isInCareForHepC')
    .addBoolean('isInCareForHiv')
    .addBoolean('isOutreach')
    .addBoolean('narcanWasTaken')
    .addBoolean('narcanWasOffered')

    .addDate('date')
    .addDate('dateOfBirth')
    .addDate('newContactDate')
    
    .addNumber('ageOfFirstInjection')    
    .addNumber('numberOfOthersHelping')    
    .addNumber('syringesGiven')
    .addNumber('syringesTaken')

    .addRelation('uid', 'contacts')
    
    .addString('countryOfBirth')
    .addString('ethnicity')
    .addString('eventNotes')
    .addString('genderIdentity')
    .addString('healthInsurer')
    .addString('hepCStatus')
    .addString('hivStatus')
    .addString('housingStatus')
    .addString('primaryDrug')
    .addString('profileNotes')
    .addString('zipCode')

    .get()
    .then(existingSchemaData => updateSchemaOnlyWhenNecessary(existingSchemaData, eventSchema))
    .catch(error => ((error.code === Parse.Error.INVALID_CLASS_NAME) ? eventSchema.save() : Promise.reject(error)))
}

module.exports = setParseSchema;