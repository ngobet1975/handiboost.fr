require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function reviewArchitecture(featureText) {
    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5.4",
        input: [
            {
                role: "system",
                content:
                    "You are a strict software architect. Return a concise structured architecture review with these sections: Architecture Summary, Boundaries, API/Data Flow, Risks, Recommendation, Blocking or Non-blocking."
            },
            {
                role: "user",
                content: featureText
            }
        ]
    });

    return response.output_text;
}

async function reviewSecurity(featureText) {
    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5.4",
        input: [
            {
                role: "system",
                content:
                    "You are a strict application security reviewer. Return a concise structured security review with these sections: Risk, Severity, Affected Area, Recommendation, Blocking or Non-blocking."
            },
            {
                role: "user",
                content: featureText
            }
        ]
    });

    return response.output_text;
}

async function main() {
    const command = process.argv[2];
    const featureText = process.argv.slice(3).join(" ");

    if (!command || !featureText) {
        console.log(`Usage:
node server.js architecture "your feature description"
node server.js security "your feature description"`);
        process.exit(1);
    }

    if (command === "architecture") {
        const result = await reviewArchitecture(featureText);
        console.log(result);
        return;
    }

    if (command === "security") {
        const result = await reviewSecurity(featureText);
        console.log(result);
        return;
    }

    console.error("Unknown command:", command);
    process.exit(1);
}

main().catch((err) => {
    console.error("OpenAI run failed:");
    console.error(err);
    process.exit(1);
});