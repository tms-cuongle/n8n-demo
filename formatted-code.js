const uploadedItems = $input.all().map(entry => entry.json);

// Build combinedDiffs
let combinedDiffs = '';

for (const uploadedFile of uploadedItems) {
  combinedDiffs += `### File: ${uploadedFile.filename}\n\n`;

  if (uploadedFile.patch) {
    const sanitizedPatch = uploadedFile.patch.replace(/```/g, "''");

    combinedDiffs += "```diff\n";
    combinedDiffs += sanitizedPatch;
    combinedDiffs += "\n```\n";
  } else {
    combinedDiffs += "No patch available (probably a binary file)";
  }

  combinedDiffs += "\n---\n\n";
}

// Build prompt
const reviewInstructions = `
You are a senior Python developer. 
Please review the following code changes in these files:

${combinedDiffs}

---
Your mission:
- Adhere to the team's coding standards:
  + Variables should follow camelCase naming convention and be intuitive.
  + String variables should be defined before print.
- Go through the code changes, file by file, focusing on meaningful updates.
- Provide inline feedback directly on the lines where modifications occur.
- Skip any files that don't contain a patch.
- Do not duplicate the filename or code snippets in your comments.
- Focus your comments solely on evaluating the code, without rewriting or editing it.
`;

return [
  {
    json: {
      user_message: reviewInstructions.trim()
    }
  }
];
