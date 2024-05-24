
results: list[tuple[str, str, str, bool]] = []

with open('voc.txt', 'r') as f:
    category = "verben"
    for line in f:
        line = line.replace("\n", "")
        if line[0] == '%':
            category = line[1].upper() + line[2:].lower()
        else:
            if line[0] == '*':
                line = line[1:]
                [tz, de] = line.split("#")
                results += [(de, tz, category, True)]
            else:
                [tz, de] = line.split("#")
                results += [(de, tz, category, False)]


with open('vocab.js', 'w') as f:
    f.write("""export const Vocabulary = [""")
    for i, (de, tz, category, recommended) in enumerate(results):
        comma_after = "," if i < len(results)-1 else ""
        line = (r"{"
                + "\"de\":\"" + de + "\","
                + "\"tz\":\"" + tz + "\","
                + "\"recommended\":" +
                ("true" if recommended else "false") + ","
                + "\"category\":\"" + category + "\"" + r"}" + comma_after + "\n")
        f.write(line)
    f.write("]")
