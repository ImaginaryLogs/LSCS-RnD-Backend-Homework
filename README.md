# LSCS-Homework

Repository to answer the back-end challenge homework for LSCS.

Tested for both Windows 10 and Ubuntu OS.

## Usage

Creating a question uses to the `/create` uri with the following request body to `POST`:

```json
{
    question: string;
    choices: string[];
    correct_answer: string;
}
```

Updating a question uses to the `/update` uri with the following request body where one of the new parameters are present to `PATCH`:

```json
{
    original_question: string
    new_parameters: {
        question: string | null | undefined;
        choices: string[] | null | undefined;
        correct_answer: string  null | undefined;
    }
}
```

Delete a question requires to the `/delete` uri with the following request body to `DELETE`:

```json
{
    question: string;
}
```

Getting question data requires to the `/get` uri with the following request body to `POST`:

```json
{
    question: string;
}
```

Getting all questions requires to go to `/list` uri with `GET`.

Submitting a requires to go to `/check_answer` uri with following to `POST`:

```json
{
    question: string;
    submitted_answer: string;
}
```

## Instructions

1) Paste in a local MongoDB connection string in the `src/config/config.mts` file, or use .env file.

2) Install the node modules via `npm i`.

3) Go to the terminal and run the following command `npm run start` in the root directory.

4) Check the console if the database is connected.

   1) If not, please make sure you pasted the local MongoDB connection string.

5) Go to website to check the html file for testing.

   1) You may also check the REST Client files.

   2) You may also check the decapricated Python file
