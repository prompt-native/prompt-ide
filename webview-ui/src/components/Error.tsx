interface ErrorProps {
    errors: string[];
}
function Error({ errors }: ErrorProps) {
    return (
        <main className="flex flex-column justify-start">
            <div className="codicon codicon-error danger"></div>
            <p>
                Failed to validate the schema, please fix the json content manually and try again.
            </p>
            {errors.map((error) => (
                <p style={{ color: "red" }}>{error}</p>
            ))}
        </main>
    );
}

export default Error;
