
  basis.require('basis.event');
  basis.require('basis.ui');
  basis.require('basis.ui.field');


 /**
  * @see ./demo/defile/form.html
  * @namespace basis.ui.form
  */

  var namespace = this.path;


  //
  // import names
  //

  var createEvent = basis.event.create;
  var events = basis.event.events;
  var field = basis.ui.field;

  var UINode = basis.ui.Node;


 /**
  * @class
  */
  var FormContent = UINode.subclass({
    className: namespace + '.FormContent',

    template: module.template('FormContent'),

    childClass: field.Field,
    childFactory: field.create,

    listen: {
      childNode: {
        commit: function(field){
          while (field = field.nextSibling)
            if (field.focusable)
              return field.focus(true);

          this.submit();
        }
      }
    },

    emit_reset: createEvent('reset'),

    onSubmit: basis.fn.$false,

    focusFirstNonEmpty: true,
    focus: function(select){
      for (var i = 0, field; field = this.childNodes[i]; i++)
        if (field.focusable && (!this.focusFirstNonEmpty || !field.getValue() || !field.getValue().length))
        {
          field.focus(select);
          return;
        }
    },

    loadData: function(data, noValidate){
      for (var i = 0, field; field = this.childNodes[i]; i++)
      {
        if (field.name in data)
        {
          field.setValue(data[field.name]);
          field.setValidity();  // set undefined validity
        }
        else
        {
          field.reset();
        }
      }

      if (!noValidate)
        this.validate();
    },
    reset: function(){
      for (var i = 0, field; field = this.childNodes[i]; i++)
        field.reset();

      this.emit_reset();
    },
    validate: function(){
      var errors = [];
      var error;

      for (var i = 0, field; field = this.childNodes[i]; i++)
        if (error = field.validate())
          errors.push(error);

      if (errors.length)
      {
        errors[0].field.focus();
        return errors;
      }

      return true;
    },
    serialize: function(){
      return this.childNodes.reduce(function(result, field){
        if (field.serializable && field.name)
          result[field.name] = field.getValue();

        return result;
      }, {});
    },
    submit: function(){
      if (this.validate() === true && this.onSubmit)
        this.onSubmit(this.serialize());
    }
  });

 /**
  * @class
  */
  var Form = FormContent.subclass({
    className: namespace + '.Form',

    formTarget: '',
    formAction: '',
    formEnctype: '',
    formMethod: 'POST',

    template: module.template('Form'),

    binding: {
      target: 'formTarget',
      action: 'formAction',
      enctype: 'formEnctype',
      method: 'formMethod'
    },

    action: {
      submit: function(){
        this.submit();
      },
      validate: function(event){
        if (this.validate() !== true)
          event.preventDefault();
      }
    },

    submit: function(){
      if (this.onSubmit)
        this.onSubmit(this.serialize());

      if (this.tmpl && this.tmpl.form)
        this.tmpl.form.submit();
    }
  });


  //
  // export names
  //

  module.exports = {
    FormContent: FormContent,
    Form: Form
  };
