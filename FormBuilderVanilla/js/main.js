class MyFormBuilder {

  constructor({elementIdToAddTheForm, formData}) {
    this.elementIdToAddTheForm = elementIdToAddTheForm;
    this.formData = formData;

    document
      .getElementById(this.elementIdToAddTheForm)
      .appendChild(this.mountForm())

    return this.form;
  }

  mountForm() {
    this.initializeForm();
    this.addFormHeader();
    this.addFormContent();
    this.addFormFooter();

    return this.form;
  }

  initializeForm() {
    this.form = document.createElement('form');
    // this.form.method = this.formData.method;
    // this.form.action = this.formData.action;
    this.form.setAttribute('id', this.id = 'id-' + Math.floor(Date.now() * Math.random()));
  }

  addFormContent() {
    const container = document.createElement('div');


    container.classList.add('container');

    for (const currentSection of this.formData.section) {
      const section = document.createElement('div');

      section.classList.add('row');

      if (currentSection.header) {
        const header = document.createElement('h2');
        header.innerText = currentSection.header

        section.appendChild(header)
      }

      currentSection.elements.forEach(currentElement => {
        let element;

        switch (currentElement.type) {
          case 'checkbox':
          case 'input': {
            element = this.createInput(currentElement.attributes);
            break;
          }

          // case 'label': {
          //   element = this.createColumnDiv(this.createLabel(currentElement.attributes));
          //   break;
          // }

          case 'radio': {
            element = this.createColumnDiv(this.createRadio(currentElement.attributes));
            break;
          }

          case 'dropdown': {
            element = this.createColumnDiv(this.createDropdown(currentElement.attributes));
            break;
          }
        }

        if (element) {
          section.appendChild(element);
          element = undefined;
        }
      })

      container.appendChild(section);
    }

    this.form.appendChild(container);
  }

  createColumnDiv(childElement) {
    const columnDiv = document.createElement('div');

    columnDiv.classList.add('col');
    columnDiv.appendChild(childElement);

    return columnDiv;
  }

  // createLabel(attributes) {
  //   const label = document.createElement('label');
  //
  //   label.id = attributes.id;
  //   label.innerText = attributes.text;
  //
  //   if (attributes.color) {
  //     label.style.color = attributes.color;
  //   }
  //
  //   return label;
  // }

  createRadio(attributes) {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');

    legend.innerText = attributes.legend;
    fieldset.appendChild(legend);

    attributes.optionElements.forEach((_, index) => {
      fieldset
        .appendChild(this.getRadioElement(attributes.optionElements[index], attributes.name));
    })

    return fieldset;
  }

  getRadioElement(radio, name) {
    const formFooter = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.htmlFor = radio.id;
    label.classList.add('form-check-label');
    label.innerText = radio.label;

    input.type = "radio";
    input.classList.add('form-check-input');
    input.value = radio.value;
    input.name = name;
    input.id = radio.id;

    if (radio.checked) {
      input.checked = true;
    }

    formFooter.classList.add('form-check');
    formFooter.appendChild(label);
    formFooter.appendChild(input);

    return formFooter;
  }

  createDropdown(attributes) {
    const select = document.createElement('select');
    const option = document.createElement('option');

    option.selected = true;
    option.disabled = true;
    option.innerText = attributes.hint;

    select.id = attributes.id;
    select.appendChild(option);

    attributes.options.forEach((_, index) => {
      select.appendChild(this.getOptionElement(attributes.options[index]))
    })

    select.name = attributes.id;
    select.classList.add('form-select')

    return select;
  }

  getOptionElement(optionProperties) {
    const option = document.createElement('option');

    option.value = optionProperties.value;
    option.innerText = optionProperties.name;

    if (optionProperties.selected) {
      option.selected = true;
    }

    return option;
  }


  createInput(attributes) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const columnDiv = document.createElement('div');
    const id = 'id-' + attributes.id;

    label.htmlFor = id;
    label.innerHTML = attributes.label;

    input.id = id;
    input.type = attributes.type;
    input.name = attributes.id;
    input.placeholder = attributes.hint;

    if (attributes.required) {
      input.required = true;
    }

    if (attributes.checkboxValue) {

      input.classList.add('form-check-input');

      label.classList.add('form-check-label');
      columnDiv.classList.add('form-check');

      if (attributes.switch) {
        columnDiv.classList.add('form-switch');
      }

      if (attributes.checked) {
        input.checked = true;
      }
    } else {
      input.classList.add('form-control');
      label.classList.add('form-input');
    }

    columnDiv.classList.add('col');
    columnDiv.appendChild(label);
    columnDiv.appendChild(input);

    return columnDiv;
  }

  addFormHeader() {
    const header = document.createElement('h1');

    header.innerText = this.formData.header;
    header.classList.add('center');

    this.form.appendChild(header);
  }

  addFormFooter() {
    const submit = document.createElement('input');
    const formFooter = document.createElement('div');

    submit.type = 'submit';
    submit.className = 'btn btn-primary'
    submit.addEventListener('click', this.submit.bind(this));

    if (this.formData.submitText) {
      submit.value = this.formData.submitText;
    }

    formFooter.classList.add('center');
    formFooter.appendChild(submit);

    if (this.formData.resetText) {
      const resetButton = document.createElement('input');

      resetButton.type = 'reset';
      resetButton.value = this.formData.resetText;
      resetButton.className = 'btn btn-primary'

      formFooter.appendChild(resetButton);
    }

    this.form.appendChild(formFooter);
  }

  async submit(event) {

    const ids = this.form.querySelectorAll('*[id]');
    const inputData = {};

    event.preventDefault();

    for (const entry of ids) {
      if ((entry.id.includes('radio')) || (entry.type === 'checkbox')) {
        inputData[this.getSimplifiedName(entry.id)] = entry.checked;
      } else {
        inputData[this.getSimplifiedName(entry.id)] = entry.value;
      }
    }


    axios.post('https://httpbin.org/post', inputData)
      .then((res) => {
        Object
          .entries(JSON.parse(res.data.data))
          .forEach(entry => {
            console.log(entry);
          })
      })
      .catch(err => console.log(err.message))
  }

  getSimplifiedName = (name) => {
    return name
      .toLowerCase()
      .replace('-', '')
      .replace('id', '');
  }
}

