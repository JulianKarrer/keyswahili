
results: list[tuple[str, str, str]] = []

with open('voc.txt', 'r') as f:
    category = "verben"
    for line in f:
        line = line.replace("\n", "")
        if line[0] == '%':
            category = line[1:].lower()
        else:
            [tz, de] = line.split("#")
            results += [(de, tz, category)]


with open('vocab.js', 'w') as f:
    f.write("""export const Vocabulary = [""")
    for i, (de, tz, category) in enumerate(results):
        comma_after = "," if i < len(results)-1 else ""
        line = (r"{" + "\"de\":\"" + de + "\"," + "\"tz\":\"" + tz +
                "\"," + "\"category\":\"" + category + "\"" + r"}" + comma_after + "\n")
        f.write(line)
    f.write("]")
