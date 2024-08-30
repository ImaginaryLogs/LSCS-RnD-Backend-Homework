console.info("Loaded.");

const port = 8080
const website_url = `${port}/`

const get_all_form_data = (form) => {
    form_data = {};
    const inputs = form.querySelectorAll('input[title]');
    
    new_parameters = {}

    inputs.forEach(input => {    
        const input_name = input.getAttribute('title');

        const is_empty = input.value == "";
        if (is_empty)
            return;

        const is_original_question = input_name.match('original_question');
        if (is_original_question)
            return form_data[input.getAttribute('title')] = input.value;

        if (input_name.match(/choice/)) {
            if (new_parameters["choices"] == null){
                new_parameters["choices"] = [];
            }

            new_parameters["choices"].push(input.value);
        } else
            new_parameters[input.getAttribute('title')] = input.value;
            
    });
    

    is_replacing_old_data = form_data['original_question'] != null;
    if (is_replacing_old_data)
        form_data["new_parameters"] = new_parameters
    else 
        form_data = new_parameters;

    return form_data;
}

const fetch_data = async (form_title, form_body) => {
    const default_header = { "Content-type": "application/json; charset=UTF-8"};
    const form_body_json = JSON.stringify(form_body);

    let method = "POST", question_uri = "";
    let request_options = {
        method: method,
        body: form_body_json,
        headers: default_header
    }

    switch (form_title) {
        case "create_question":
            question_uri = `create/`;
            break;
        case "update_question":
            question_uri = `update/`;
            request_options["method"] = "PATCH"
            break;
        case "delete_question":
            question_uri = `delete/`;
            request_options["method"] = "DELETE"
            break;
        case "get_question":
            question_uri = `get/`;
            break;
        case "check_answer":
            question_uri = `check_answer/`;
            break;
    }
    
    return fetch(question_uri, request_options).then(response => response.json());
}

const handleFormOnSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const form_body = get_all_form_data(form);
    const output_paragraph = document.getElementById(`${form.getAttribute('title')}_output`);
    
    let result = await fetch_data(form.getAttribute('title'), form_body);

    output_paragraph.textContent = `Request Form Data: ${JSON.stringify(form_body, null, 2)}\n\nResponse: ${JSON.stringify(result, null, 2)}`;
}

const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', handleFormOnSubmit);
});

const list_question = async () => {
    result = await fetch(`list/`, {
        method: "GET",
    })
    .then(response => response.json());
    const output_paragraph = document.getElementById(`list_question_output`);

    output_paragraph.textContent = `Response: ${JSON.stringify(result, null, 2)}`;
}

document.getElementById(`list_question`).addEventListener('click', list_question);