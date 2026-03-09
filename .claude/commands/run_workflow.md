# Run Workflow: Research, Plan & Implement

Based on the `Instructions` below, take the `Variables` follow the `Run` section to research, plan and execute a whole workflow. Then follow the `Report` section to report the results of your work.

## Variables

USER_REQUEST: $ARGUMENTS


## Instructions

- You are orchestrating claude code instances to address the `USER_REQUEST`.
- You first research the codebase, then create a plan and finally implement it.
- Create detailed, self-contained prompts for each agent.
- Remember agents are stateless and need complete context.
- Use `--permission-mode bypassPermissions`


## Workflow

1. IF the `USER_REQUEST` includes a Jira Ticket (e.g. PROJ-123), use the Bash tool to run a claude code instance that will retrieve and locally store the Jira ticket details. The agent must follow this prompt: `Read and format Jira ticket <jira_ticket_id>. Include all content with proper markdown formatting: headings, code blocks, lists, tables, and links. Preserve the exact structure and formatting from Jira. Store it in thoughts/shared/tickets/<jira_ticket_id>.md. Report only the file path`. ELSE proceed to the next step.
2. Use the Bash tool to run a claude code instance that will perform a codebase research to address the `USER_REQUEST`. The agent must be prompted using the slash command: `/research_codebase "<prompt>"`
3. Use the Bash tool to create a claude code instance that will perform the planning step. The agent must be prompted using the slash command: `/create_plan "autonomous" "<research document from previous step>"`.
4. Use the Bash tool to create a claude code instance that will perform the implementation step. The agent must be prompted using the slash command: `/implement_plan "autonomous" "<plan document from the previous step>"`.
5. Run and fix all test by running the `test_loop`.

<test_loop>
- Use the Bash tool to create a claude code instance that will run the tests. The agent must be prompted using the slash command: `/test`.
- IF any test fails, then use the Bash tool to create a claude code instance that will fix the failing tests. The agent must be prompted using the slash command: `/resolve_failed_tests "<test results from previous step>"`.
- ELSE exit the `test_loop`
</test_loop>

## Report
- Summarize the work you've just done in a concise bullet point list.
- Report the files and total lines changed with `git diff --stat`
