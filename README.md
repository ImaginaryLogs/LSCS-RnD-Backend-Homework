# LSCS-RnD-Backend-Homework

Repository to answer the back-end challenge homework for LSCS.

Tested for both Windows 10 and Ubuntu OS.

## Frameworks used

- Node.js

- Express.js

- Mongoose and MongoDB

## Usage

This is a brief explanation on how to submit data.

### Create a Question

Creating a question uses to the `/create` uri with the following request body to `POST`:

```ts
{
    question: string;
    choices: string[];
    correct_answer: string;
}
```

### Update a Question

Updating a question uses to the `/update` uri with the following request body where one of the new parameters are present to `PATCH`:

```ts
{
    original_question: string
    new_parameters: {
        question: string | null | undefined;
        choices: string[] | null | undefined;
        correct_answer: string  null | undefined;
    }
}
```

### Delete a Question

Delete a question requires to the `/delete` uri with the following request body to `DELETE`:

```ts
{
    question: string;
}
```

### Get Question data

Getting question data requires to the `/get` uri with the following request body to `POST`:

```ts
{
    question: string;
}
```

### Get all Questions

Getting all questions requires to go to `/list` uri with `GET`.

### Check Answer

Submitting a requires to go to `/check_answer` uri with following to `POST`:

```ts
{
    question: string;
    submitted_answer: string;
}
```

## Instructions

1) Install using `git clone https://github.com/ImaginaryLogs/LSCS-Homework.git`;

2) Paste in a local MongoDB connection string in the `src/config/config.mts` file, or use .env file.

3) Install the node modules via `npm i`.

4) Go to the terminal and run the following command `npm run dev` in the root directory.

5) Check the console if the database is connected.

   1) If not, please make sure you pasted the local MongoDB connection string.

6) Go to website outputted by the console to check the html file for testing.

   1) You may also check the REST Client files.

   2) You may also check the decapricated Python unittest file.
