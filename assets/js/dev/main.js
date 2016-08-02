function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

var app = {};

app.Triggers = {
	activeTrigger: 'active-trigger',

	init: function(){
		this.activeTriggers();
	},
	activeTriggers: function(){
		var trigger = document.getElementsByClassName(this.activeTrigger);

		for (i = 0; i < trigger.length; i++) {
			trigger[i].addEventListener('click', function(e){
				var target = document.getElementById(this.dataset.active);

				target.classList.toggle('active');
				this.classList.toggle('active');

				e.preventDefault();
			});
		}
	}
}

app.Slider = {
	slider:  'slider',
	navDots: 'nav-dots',
	navDot:  'nav-dot',
	active:  'active',
	data:    'data-link',
	init: function(){
		this.intitSliders();
	},
	intitSliders: function(){
		var sliders = document.getElementsByClassName(this.slider);

		for (var i = 0; i < sliders.length; i ++) {

			var slider = sliders[i];
      var slides = slider.children[0].children;
      var slidesLength = slides.length;

      if(slidesLength > 1){
      	this.setSlidePosition(slides);
      	this.createDots(slidesLength, slider);
      	this.dotClick();
      }
    }
	},
	createDots: function(length, slider){
		var dotsContainer = document.createElement('ul');
		dotsContainer.className = this.navDots;

		for (var i = 0; i < length; i++){
			var dot = document.createElement('li');

			dot.className = this.navDot;
			dot.setAttribute(this.data, [i]);

    	dotsContainer.appendChild(dot);
    }

    slider.appendChild(dotsContainer);
    this.highlightFirstDot(dotsContainer);
	},
	highlightFirstDot: function(container){
		container.firstChild.classList.add(this.active);
	},
	dotClick: function(){
		var dots = document.getElementsByClassName(this.navDot);

		for (i = 0; i < dots.length ; i++) {
			dots[i].addEventListener('click', function(){
	    	if(!hasClass(this, 'active')){;
	    		app.Slider.switchSlide(this);
	    		app.Slider.changeDot(this);
	    		this.classList.add('active');
	    	}
	    });
		}
	},
	changeDot: function(dot){
		var dots = dot.parentElement.children;
		this.removeActive(dots);
	},
	removeActive: function(elements){
		for (i = 0; i < elements.length; i++){
			elements[i].classList.remove(this.active);
		}
	},
	setSlidePosition: function(children){
		for (i = 0; i < children.length; i++){
			children[i].setAttribute(this.data, [i]);
		}
	},
	switchSlide: function(dot){
		var slides = dot.parentElement.parentElement.children[0].children;
		var targetSlide = dot.dataset.link;

		this.hideSlides(slides);

		for (i = 0; i < slides.length; i++){
			if (slides[i].dataset.link == targetSlide){
				slides[i].classList.add(this.active);
			}
		}
	},
	hideSlides: function(slides){
		this.removeActive(slides);
	},
}

app.Form = {
	form:           'form',
	required:       'required',

	validError:     'validation-error',
	validMessage:   'validation-message',

	reqFieldError:  'This field is mandatory',
	nameError:      'Name must be 2-32 chars long and contain A-z letters',
	phoneError:     'Phone must be 6-12 chars long and be numeric',
	emailError:     'Please enter a valid email',

	loadingClass:   'loading',
	ajaxMessageCls: 'ajax-respond',
	ajaxSuccess:    'Yay! Data send!',
	ajaxError:      'Whoops, looks like something went wrong!',


	init: function(){
		this.formSubmit();
	},
	formSubmit: function(){
		var form;
		var submitBtn = document.querySelectorAll('input[type=submit]');

		for (i = 0; i < submitBtn.length; i++) {
			submitBtn[i].addEventListener('click', function(e){
				form = this.parentElement;

				if (app.Form.validate(form)) {
					app.Form.sendRequest(form);
				}

				e.preventDefault();
			});
		}
	},
	validate: function(form){
		var field;
		var required = form.getElementsByClassName(this.required);
		var invalid = form.getElementsByClassName(this.validError);

		for (i = 0; i < required.length; i++) {
			field = required[i];

			this.checkEmptyValue(field);
			this.checkName(field);
			this.checkPhone(field);
			this.checkEmail(field);
		}

		if (invalid.length == 0) {
			return true;
		}
	},
	checkEmptyValue: function(field){
		if (field.value == "" || null) {
			this.addEmptyValueError(field);
		} else {
			this.removeEmptyValueError(field);
		}
	},
	checkName: function(field){
		var name = 'name';
		var pattern = /[A-z]{2,32}/;
		var message = this.nameError;

		this.validateField(field, name, pattern, message);
	},
	checkPhone: function(field){
		var name = 'phone';
		var pattern = /^\d{6,12}$/;
		var message = this.phoneError;

		this.validateField(field, name, pattern, message);
	},
	checkEmail: function(field){
		var name = 'email';
		var pattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
		var message = this.emailError;

		this.validateField(field, name, pattern, message);
	},
	validateField: function(field, fieldName, pattern, message){
		if (field.getAttribute('name') == fieldName) {
			var value = field.value;
			var messageAdded = field.nextElementSibling.classList.contains(this.validMessage);

			if (value.match(pattern) == null) {

				if (!messageAdded){
					this.addErrorContainer(field, message);
					field.classList.add(this.validError);
				}

			} else {

				if (messageAdded) {
					this.removeErrorContainer(field, message);
					field.classList.remove(this.validError);
				}

			}
		}
	},
	createMessageContainer: function(){
		var container = document.createElement('label');
		container.className = 'message';

		return container;
	},
	addErrorContainer: function(element, message){
		this.messageAdded = true;

		var fieldID = element.getAttribute('ID');
		var container = this.createMessageContainer();

		container.innerHTML = message;
		container.setAttribute('for', fieldID);
		container.classList.add(this.validMessage);

		insertAfter(container, element)
	},
	removeErrorContainer: function(field){
		this.messageAdded = false;
		var parent = field.parentElement;

		parent.removeChild(field.nextSibling);
		field.classList.remove(this.validError);
	},
	addEmptyValueError: function(element){
		element.setAttribute('placeholder', this.reqFieldError);
	},
	removeEmptyValueError: function(element){
		element.removeAttribute('placeholder');
	},
	ajaxMessage: function(){
		var container = this.createMessageContainer();
		container.classList.add(this.ajaxMessageCls);

		return container;
	},
	showAjaxRespond: function(form, messageText){
		var message = app.Form.ajaxMessage();
		message.innerHTML = messageText;

		form.appendChild(message);

		setTimeout(function(){
      form.removeChild(message);
    }, 3000);
	},
	prepareData: function(form){
		var fields = form.elements;
		var fieldsArray = [];

		for (var i = 0; i < fields.length; i++) {
			if (fields[i].getAttribute('name')){
				field = fields[i].getAttribute('name') + '=' + fields[i].value;
				fieldsArray[i] = field;
			}
		}

		fieldsArray = fieldsArray.join('&');
		fieldsArray = fieldsArray.slice(1,fieldsArray.length);

		return fieldsArray;
	},
	sendRequest: function(form){
		form.classList.add(app.Form.loadingClass);

		var xhr = new XMLHttpRequest();
		var data = app.Form.prepareData(form);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE ) {
         form.classList.remove(app.Form.loadingClass);

         if (xhr.status == 200) {
          app.Form.showAjaxRespond(form, app.Form.ajaxSuccess);
          form.reset();
         } else {
          messageText =
          app.Form.showAjaxRespond(form, app.Form.ajaxError);
         }
      }
    }

    xhr.open(form.getAttribute('method'), form.getAttribute('action'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
	}
}

window.onload = (function(){
	app.Triggers.init();
	app.Slider.init();
	app.Form.init()
});