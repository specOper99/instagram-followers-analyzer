import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    DirectionProvider,
    Group,
    List,
    MantineProvider,
    Menu,
    Paper,
    SegmentedControl,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    TextInput,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import {
    IconBolt,
    IconCheck,
    IconCopy,
    IconDeviceDesktop,
    IconDownload,
    IconExternalLink,
    IconLanguage,
    IconLock,
    IconMoonStars,
    IconShieldCheck,
    IconSun,
    IconUserCheck,
    IconUserMinus,
    IconUserPlus,
    IconUsers,
    IconUsersGroup,
    IconWifiOff,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    createT,
    getInitialLang,
    LANG_OPTIONS,
    RTL_LANGS,
    THEME_OPTIONS,
} from "./i18n";
import {
    computeLists,
    dedupePreserveOrderBy,
    instagramProfileUrl,
    normalizeUsername,
    pickExportFilesFromAnySelection,
    readJsonFileWithMeta,
} from "./lib/instagram";
import { appTheme } from "./theme";

const INSTAGRAM_DOWNLOAD_URL =
    "https://accountscenter.instagram.com/info_and_permissions/dyi/";

function downloadText(filename, lines) {
    const blob = new Blob([lines.join("\n") + (lines.length ? "\n" : "")], {
        type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

async function copyToClipboard(text) {
    if (!text) return;
    if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
    ) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
}

function baseLabelForKey(t, key) {
    if (key === "not_following_back") return t("viewNotFollowingBackBtn");
    if (key === "you_dont_follow_back") return t("viewYouDontFollowBackBtn");
    if (key === "mutuals") return t("viewMutualsBtn");
    if (key === "followers") return t("viewFollowersBtn");
    if (key === "following") return t("viewFollowingBtn");
    if (key === "pending") return t("viewPendingBtn");
    return String(key || "");
}

function LandingPage({ t, onStart }) {
    return (
        <Container size="sm" py={80}>
            <Stack align="center" gap="xl">
                <ThemeIcon size={80} radius={100} variant="light" color="blue">
                    <IconShieldCheck size={48} />
                </ThemeIcon>

                <Stack align="center" gap="xs">
                    <Title order={1} ta="center" fw={900} size={42}>
                        {t("landingTitle")}
                    </Title>
                    <Text c="dimmed" ta="center" size="lg" maw={500}>
                        {t("landingDescription")}
                    </Text>
                </Stack>

                <Paper withBorder p="xl" radius="md" bg="var(--mantine-color-blue-light)">
                    <Group wrap="nowrap" align="flex-start">
                        <ThemeIcon variant="white" color="blue" radius="md">
                            <IconWifiOff size={20} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                            {t("landingOfflineTip")}
                        </Text>
                    </Group>
                </Paper>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" w="100%">
                    <Paper withBorder p="md" radius="md">
                        <Stack align="center" gap="xs">
                            <IconLock size={24} color="var(--mantine-color-blue-6)" />
                            <Text fw={700} size="sm">{t("landingPrivateTitle")}</Text>
                            <Text size="xs" c="dimmed" ta="center">{t("landingPrivateDesc")}</Text>
                        </Stack>
                    </Paper>
                    <Paper withBorder p="md" radius="md">
                        <Stack align="center" gap="xs">
                            <IconWifiOff size={24} color="var(--mantine-color-blue-6)" />
                            <Text fw={700} size="sm">{t("landingOfflineTitle")}</Text>
                            <Text size="xs" c="dimmed" ta="center">{t("landingOfflineDesc")}</Text>
                        </Stack>
                    </Paper>
                    <Paper withBorder p="md" radius="md">
                        <Stack align="center" gap="xs">
                            <IconShieldCheck size={24} color="var(--mantine-color-blue-6)" />
                            <Text fw={700} size="sm">{t("landingSecureTitle")}</Text>
                            <Text size="xs" c="dimmed" ta="center">{t("landingSecureDesc")}</Text>
                        </Stack>
                    </Paper>
                </SimpleGrid>

                <Button size="xl" radius="md" onClick={onStart} fullWidth maw={300}>
                    {t("landingStartBtn")}
                </Button>
            </Stack>
        </Container>
    );
}

export default function App() {
    const systemScheme = useColorScheme();

    const [language, setLanguage] = useLocalStorage({
        key: "ig_follow_diff_lang",
        defaultValue: getInitialLang(""),
    });

    const [themeMode, setThemeMode] = useLocalStorage({
        key: "ig_follow_diff_theme",
        defaultValue: "system",
    });

    const t = useMemo(() => createT(language), [language]);
    const isRtl = RTL_LANGS.has(language);

    useEffect(() => {
        // Ensure RTL/LTR affects the whole document, not only Mantine components.
        document.documentElement.dir = isRtl ? "rtl" : "ltr";
        document.documentElement.lang = language || "en";
    }, [isRtl, language]);

    const forcedScheme =
        themeMode === "light" || themeMode === "dark" ? themeMode : undefined;
    const effectiveScheme = forcedScheme || systemScheme;

    const [status, setStatus] = useState({ text: "", kind: "dimmed" });
    const [results, setResults] = useState(null);
    const [meta, setMeta] = useState({
        followers: null,
        following: null,
        pending: null,
    });
    const [activeKey, setActiveKey] = useState("not_following_back");
    const [metaModalOpen, setMetaModalOpen] = useState(false);
    const [metaModalData, setMetaModalData] = useState(null);
    const [metaModalTitle, setMetaModalTitle] = useState("");

    // Sorting & filtering
    const [sortMode, setSortMode] = useState("original");
    const [searchQuery, setSearchQuery] = useState("");
    const [onlyWithDate, setOnlyWithDate] = useState(false);
    const [viewMode, setViewMode] = useState("cards");
    const [busy, setBusy] = useState(false);
    const [pickMode, setPickMode] = useState("folder");
    const [showLanding, setShowLanding] = useLocalStorage({
        key: "ig_follow_diff_show_landing",
        defaultValue: true,
    });

    const folderInputRef = useRef(null);
    const followersInputRef = useRef(null);
    const followingInputRef = useRef(null);

    const activeList = useMemo(() => {
        if (!results) return [];
        const base = (results[activeKey] || []).slice();

        function timestampForUser(u) {
            const n = normalizeUsername(u);
            return (
                meta?.followers?.[n]?.timestamp ||
                meta?.following?.[n]?.timestamp ||
                meta?.pending?.[n]?.timestamp ||
                null
            );
        }

        // Filter
        let filtered = base.filter((u) => {
            if (
                searchQuery &&
                !u.toLowerCase().includes(searchQuery.toLowerCase())
            )
                return false;
            if (onlyWithDate && !timestampForUser(u)) return false;
            return true;
        });

        // Sort
        if (sortMode === "alpha-asc")
            filtered.sort((a, b) =>
                a.localeCompare(b, undefined, { sensitivity: "base" })
            );
        else if (sortMode === "alpha-desc")
            filtered.sort((a, b) =>
                b.localeCompare(a, undefined, { sensitivity: "base" })
            );
        else if (sortMode === "date-asc")
            filtered.sort(
                (a, b) =>
                    (timestampForUser(a) || 0) - (timestampForUser(b) || 0)
            );
        else if (sortMode === "date-desc")
            filtered.sort(
                (a, b) =>
                    (timestampForUser(b) || 0) - (timestampForUser(a) || 0)
            );

        return filtered;
    }, [results, activeKey, sortMode, searchQuery, onlyWithDate, meta]);

    const rawText = activeList.join("\n");

    function formatSince(ts) {
        if (!ts) return "";
        try {
            const d = new Date(ts * 1000);
            if (Number.isNaN(d.getTime())) return "";
            return new Intl.DateTimeFormat(language || "en", {
                dateStyle: "medium",
            }).format(d);
        } catch {
            return "";
        }
    }

    function metaForUser(source, username) {
        const table = source && typeof source === "object" ? source : null;
        if (!table) return null;
        const norm = normalizeUsername(username);
        if (!norm) return null;
        return table[norm] || null;
    }

    function setStatusText(text, kind = "dimmed") {
        setStatus({ text, kind });
    }

    function clearFolderInput() {
        if (folderInputRef.current) folderInputRef.current.value = "";
    }

    function clearFileInputs() {
        if (followersInputRef.current) followersInputRef.current.value = "";
        if (followingInputRef.current) followingInputRef.current.value = "";
    }

    function onPickModeChange(next) {
        const nextMode = next || "folder";
        setPickMode(nextMode);
        // Avoid mixing sources: clear the hidden set.
        if (nextMode === "folder") clearFileInputs();
        if (nextMode === "files") clearFolderInput();
    }

    function renderStats() {
        if (!results) return null;

        function colorForKey(key) {
            if (key === "followers") return "blue";
            if (key === "following") return "grape";
            if (key === "not_following_back") return "red";
            if (key === "you_dont_follow_back") return "yellow";
            if (key === "mutuals") return "green";
            if (key === "pending") return "violet";
            return "gray";
        }

        function StatCard({ icon, label, value, color }) {
            return (
                <Paper
                    withBorder
                    radius="md"
                    p="sm"
                    style={{
                        borderInlineStart: `4px solid var(--mantine-color-${color}-6)`,
                    }}
                >
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <Stack gap={2} style={{ minWidth: 0 }}>
                            <Text
                                size="xs"
                                c="dimmed"
                                fw={600}
                                style={{ lineHeight: 1.1 }}
                            >
                                {label}
                            </Text>
                            <Text size="xl" fw={800} style={{ lineHeight: 1 }}>
                                {value}
                            </Text>
                        </Stack>
                        <ThemeIcon
                            variant="light"
                            radius="md"
                            size="lg"
                            color={color}
                        >
                            {icon}
                        </ThemeIcon>
                    </Group>
                </Paper>
            );
        }

        return (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <StatCard
                    icon={<IconUsers size={18} />}
                    label={t("statsFollowers")}
                    value={results.followers.length}
                    color={colorForKey("followers")}
                />
                <StatCard
                    icon={<IconUsersGroup size={18} />}
                    label={t("statsFollowing")}
                    value={results.following.length}
                    color={colorForKey("following")}
                />
                <StatCard
                    icon={<IconUserMinus size={18} />}
                    label={t("statsNotFollowingBack")}
                    value={results.not_following_back.length}
                    color={colorForKey("not_following_back")}
                />
                <StatCard
                    icon={<IconUserPlus size={18} />}
                    label={t("statsYouDontFollowBack")}
                    value={results.you_dont_follow_back.length}
                    color={colorForKey("you_dont_follow_back")}
                />
                <StatCard
                    icon={<IconUserCheck size={18} />}
                    label={t("statsMutuals")}
                    value={results.mutuals.length}
                    color={colorForKey("mutuals")}
                />
                <StatCard
                    icon={<IconUsers size={18} />}
                    label={t("viewPendingBtn")}
                    value={results.pending.length}
                    color={colorForKey("pending")}
                />
            </SimpleGrid>
        );
    }

    async function onParse() {
        try {
            setBusy(true);
            setResults(null);
            setMeta({ followers: null, following: null });
            setActiveKey("not_following_back");
            setStatusText(t("statusReadingFiles"), "dimmed");

            const allSelected = [];
            if (
                pickMode === "folder" &&
                folderInputRef.current?.files?.length
            ) {
                allSelected.push(...Array.from(folderInputRef.current.files));
            }
            if (
                pickMode === "files" &&
                followersInputRef.current?.files?.length
            ) {
                allSelected.push(
                    ...Array.from(followersInputRef.current.files)
                );
            }
            if (
                pickMode === "files" &&
                followingInputRef.current?.files?.length
            ) {
                allSelected.push(
                    ...Array.from(followingInputRef.current.files)
                );
            }

            const { followersFiles, followingFile, pendingFiles } =
                pickExportFilesFromAnySelection(allSelected);

            if (!followersFiles.length) throw new Error("NO_FOLLOWERS");
            if (!followingFile) throw new Error("NO_FOLLOWING");

            setStatusText(
                t("statusParsingFollowers", { n: followersFiles.length }),
                "dimmed"
            );

            const followersAll = [];
            const followersMeta = Object.create(null);
            for (const f of followersFiles) {
                const { users, metaByNorm } = await readJsonFileWithMeta(f);
                for (const u of users) followersAll.push(u);
                for (const [k, v] of Object.entries(metaByNorm || {})) {
                    if (!followersMeta[k]) followersMeta[k] = v;
                    else {
                        const a = followersMeta[k];
                        const aTs =
                            typeof a?.timestamp === "number"
                                ? a.timestamp
                                : null;
                        const bTs =
                            typeof v?.timestamp === "number"
                                ? v.timestamp
                                : null;
                        followersMeta[k] = {
                            username: a?.username || v?.username,
                            href: a?.href || v?.href,
                            timestamp:
                                aTs == null
                                    ? bTs
                                    : bTs == null
                                    ? aTs
                                    : Math.min(aTs, bTs),
                        };
                    }
                }
            }
            const followers = dedupePreserveOrderBy(
                followersAll,
                normalizeUsername
            );
            const followingData = await readJsonFileWithMeta(followingFile);
            const following = followingData.users;

            // Pending follow requests
            const pendingAll = [];
            const pendingMeta = Object.create(null);
            for (const f of pendingFiles || []) {
                const { users, metaByNorm } = await readJsonFileWithMeta(f);
                console.log('Pending file', f.name, 'users:', users);
                for (const u of users) pendingAll.push(u);
                for (const [k, v] of Object.entries(metaByNorm || {})) {
                    if (!pendingMeta[k]) pendingMeta[k] = v;
                    else {
                        const a = pendingMeta[k];
                        const aTs =
                            typeof a?.timestamp === "number"
                                ? a.timestamp
                                : null;
                        const bTs =
                            typeof v?.timestamp === "number"
                                ? v.timestamp
                                : null;
                        pendingMeta[k] = {
                            username: a?.username || v?.username,
                            href: a?.href || v?.href,
                            timestamp:
                                aTs == null
                                    ? bTs
                                    : bTs == null
                                    ? aTs
                                    : Math.min(aTs, bTs),
                        };
                    }
                }
            }
            console.log('Pending all:', pendingAll);
            const pending = dedupePreserveOrderBy(
                pendingAll,
                normalizeUsername
            );
            console.log('Pending deduped:', pending);

            setMeta({
                followers: followersMeta,
                following: followingData.metaByNorm || null,
                pending: pendingMeta,
            });

            const computed = computeLists(followers, following, pending);
            setResults(computed);
            console.log('Results pending:', computed.pending);
            setActiveKey("not_following_back");
            setViewMode("cards");
            setStatusText(t("statusDone"), "green");
        } catch (e) {
            const code = e?.message;
            if (code === "NO_FOLLOWERS") {
                setStatusText(t("errNoFollowers"), "red");
            } else if (code === "NO_FOLLOWING") {
                setStatusText(t("errNoFollowing"), "red");
            } else if (code === "PARSE_JSON") {
                setStatusText(
                    t("errParseJson", { name: e?.fileName || "" }),
                    "red"
                );
            } else {
                setStatusText(String(e?.message || e), "red");
            }
        } finally {
            setBusy(false);
        }
    }

    async function onCopyList() {
        try {
            await copyToClipboard(rawText);
            setStatusText(t("copied"), "green");
            window.setTimeout(
                () =>
                    setStatusText(
                        results ? t("statusDone") : t("statusWaiting"),
                        "dimmed"
                    ),
                900
            );
        } catch {
            // ignore
        }
    }

    function onDownloadActive() {
        if (!results) return;
        const map = {
            not_following_back: "not_following_back.txt",
            you_dont_follow_back: "you_dont_follow_back.txt",
            mutuals: "mutuals.txt",
            followers: "followers.txt",
            pending: "pending_follow_requests.txt",
            following: "following.txt",
        };
        downloadText(map[activeKey] || "list.txt", activeList);
    }

    const viewButtons = useMemo(() => {
        if (!results) {
            return [
                { key: "not_following_back", count: 0 },
                { key: "you_dont_follow_back", count: 0 },
                { key: "mutuals", count: 0 },
                { key: "followers", count: 0 },
                { key: "pending", count: 0 },
                { key: "following", count: 0 },
            ];
        }
        return [
            {
                key: "not_following_back",
                count: results.not_following_back.length,
            },
            {
                key: "you_dont_follow_back",
                count: results.you_dont_follow_back.length,
            },
            { key: "mutuals", count: results.mutuals.length },
            { key: "followers", count: results.followers.length },
            { key: "pending", count: results.pending.length },
            { key: "following", count: results.following.length },
        ];
    }, [results]);

    function colorForListKey(key) {
        if (key === "followers") return "blue";
        if (key === "following") return "grape";
        if (key === "not_following_back") return "red";
        if (key === "you_dont_follow_back") return "yellow";
        if (key === "mutuals") return "green";
        if (key === "pending") return "violet";
        return "gray";
    }

    return (
        <MantineProvider
            defaultColorScheme="auto"
            forceColorScheme={forcedScheme}
            theme={appTheme}
        >
            <DirectionProvider dir={isRtl ? "rtl" : "ltr"}>
                <Box
                    component="header"
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                        borderBottom:
                            "1px solid color-mix(in srgb, var(--mantine-color-gray-4), transparent 35%)",
                        background:
                            "color-mix(in srgb, var(--mantine-color-body), transparent 8%)",
                        backdropFilter: "blur(14px)",
                    }}
                >
                    <Container size="lg" py="sm" dir={isRtl ? "rtl" : "ltr"}>
                        <Group
                            justify="space-between"
                            align="center"
                            wrap="nowrap"
                            gap="sm"
                        >
                            <Group
                                gap="sm"
                                align="center"
                                wrap="nowrap"
                                style={{ minWidth: 0, flex: 1 }}
                            >
                                <img
                                    src="/favicon.svg"
                                    width="32"
                                    height="32"
                                    alt=""
                                    sizes="32px"
                                    style={{ display: "block" }}
                                />

                                <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                                    <Group gap="xs" wrap="wrap">
                                        <Title
                                            order={3}
                                            style={{
                                                lineHeight: 1.1,
                                                // Allow wrapping so the title remains visible on very small screens
                                            }}
                                        >
                                            {t("appTitle")}
                                        </Title>
                                        <Badge
                                            variant="light"
                                            color="green"
                                            leftSection={<IconShieldCheck size={12} />}
                                            visibleFrom="xs"
                                        >
                                            {t("badgeNoUpload")}
                                        </Badge>
                                    </Group>
                                </Stack>
                            </Group>

                            <Group
                                gap="sm"
                                wrap="nowrap"
                                justify="flex-end"
                                align="center"
                            >
                                <Group gap="xs" hiddenFrom="sm">
                                    <Menu
                                        withinPortal
                                        position="bottom-end"
                                        shadow="md"
                                    >
                                        <Menu.Target>
                                            <ActionIcon
                                                variant="subtle"
                                                size="lg"
                                                aria-label={t("langLabel")}
                                            >
                                                <IconLanguage size={18} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>
                                                {t("langLabel")}
                                            </Menu.Label>
                                            {LANG_OPTIONS.map((opt) => (
                                                <Menu.Item
                                                    key={opt.value}
                                                    onClick={() =>
                                                        setLanguage(opt.value)
                                                    }
                                                    rightSection={
                                                        opt.value ===
                                                        language ? (
                                                            <IconCheck
                                                                size={16}
                                                            />
                                                        ) : null
                                                    }
                                                >
                                                    {opt.label}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Dropdown>
                                    </Menu>

                                    <Menu
                                        withinPortal
                                        position="bottom-end"
                                        shadow="md"
                                    >
                                        <Menu.Target>
                                            <ActionIcon
                                                variant="subtle"
                                                size="lg"
                                                aria-label={t("themeLabel")}
                                            >
                                                {themeMode === "dark" ? (
                                                    <IconMoonStars size={18} />
                                                ) : themeMode === "light" ? (
                                                    <IconSun size={18} />
                                                ) : (
                                                    <IconDeviceDesktop
                                                        size={18}
                                                    />
                                                )}
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>
                                                {t("themeLabel")}
                                            </Menu.Label>
                                            {THEME_OPTIONS.map((opt) => (
                                                <Menu.Item
                                                    key={opt.value}
                                                    onClick={() =>
                                                        setThemeMode(opt.value)
                                                    }
                                                    leftSection={
                                                        opt.value === "dark" ? (
                                                            <IconMoonStars
                                                                size={16}
                                                            />
                                                        ) : opt.value ===
                                                          "light" ? (
                                                            <IconSun
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <IconDeviceDesktop
                                                                size={16}
                                                            />
                                                        )
                                                    }
                                                    rightSection={
                                                        opt.value ===
                                                        themeMode ? (
                                                            <IconCheck
                                                                size={16}
                                                            />
                                                        ) : null
                                                    }
                                                >
                                                    {t(opt.labelKey)}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>

                                <Group gap="sm" visibleFrom="sm">
                                    <Select
                                        label={t("langLabel")}
                                        data={LANG_OPTIONS}
                                        value={language}
                                        onChange={(v) => setLanguage(v || "en")}
                                        w={170}
                                    />
                                    <Select
                                        label={t("themeLabel")}
                                        data={THEME_OPTIONS.map((o) => ({
                                            value: o.value,
                                            label: t(o.labelKey),
                                        }))}
                                        value={themeMode}
                                        onChange={(v) =>
                                            setThemeMode(v || "system")
                                        }
                                        w={170}
                                    />
                                </Group>
                            </Group>
                        </Group>
                    </Container>
                </Box>

                {showLanding ? (
                    <LandingPage t={t} onStart={() => setShowLanding(false)} />
                ) : (
                    <Container size="lg" py="xl" dir={isRtl ? "rtl" : "ltr"}>
                        <Stack gap="md">
                            <Card withBorder radius="lg" p="lg">
                                <Stack gap="sm">
                                    <Title order={4}>{t("aboutTitle")}</Title>
                                    <Text>{t("aboutLead")}</Text>
                                    <Paper withBorder radius="md" p="sm">
                                        <Stack gap={6}>
                                            <Text fw={700} size="sm">
                                                {t("howItWorksTitle")}
                                            </Text>
                                            <List size="sm" spacing="xs">
                                                {t("howItWorks").map((it) => (
                                                    <List.Item key={it.key}>
                                                        {it.text}
                                                    </List.Item>
                                                ))}
                                            </List>
                                            <Text c="dimmed" size="sm">
                                                {t("privacyNote")}
                                            </Text>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Card>

                            <Card withBorder radius="lg" p="lg">
                            <Group
                                justify="space-between"
                                align="flex-start"
                                wrap="wrap"
                                gap="md"
                            >
                                <Stack
                                    gap={6}
                                    style={{ flex: 1, minWidth: 260 }}
                                >
                                    <Group gap={8} wrap="wrap">
                                        <Button
                                            variant="light"
                                            leftSection={
                                                <IconDownload size={16} />
                                            }
                                            onClick={() =>
                                                window.open(
                                                    INSTAGRAM_DOWNLOAD_URL,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                )
                                            }
                                        >
                                            {t("openDownloadPageBtn")}
                                        </Button>
                                        <Text c="dimmed" size="sm">
                                            {t("downloadHint")}
                                        </Text>
                                    </Group>

                                    <List size="sm" spacing="xs">
                                        {t("instructions").map((it) => (
                                            <List.Item key={it.key}>
                                                {it.node}
                                            </List.Item>
                                        ))}
                                    </List>
                                </Stack>
                            </Group>
                        </Card>

                        <Card withBorder radius="lg" p="lg">
                            <Stack gap="sm">
                                <Title order={4}>{t("inputTitle")}</Title>

                                <Paper withBorder radius="md" p="sm">
                                    <Group
                                        justify="space-between"
                                        align="center"
                                        wrap="wrap"
                                        gap="sm"
                                    >
                                        <Text fw={600} size="sm">
                                            {t("pickModeLabel")}
                                        </Text>
                                        <SegmentedControl
                                            value={pickMode}
                                            onChange={onPickModeChange}
                                            data={[
                                                {
                                                    value: "folder",
                                                    label: t("pickModeFolder"),
                                                },
                                                {
                                                    value: "files",
                                                    label: t("pickModeFiles"),
                                                },
                                            ]}
                                        />
                                    </Group>
                                </Paper>

                                {pickMode === "folder" ? (
                                    <Stack gap={6}>
                                        <Text fw={600} size="sm">
                                            {t("folderPickLabel")}
                                        </Text>
                                        <input
                                            ref={folderInputRef}
                                            type="file"
                                            multiple
                                            // eslint-disable-next-line react/no-unknown-property
                                            webkitdirectory=""
                                            // eslint-disable-next-line react/no-unknown-property
                                            directory=""
                                            onChange={() => {
                                                // If user picked a folder, ensure we stay in folder mode.
                                                if (
                                                    folderInputRef.current
                                                        ?.files?.length
                                                )
                                                    onPickModeChange("folder");
                                            }}
                                        />
                                        <Text c="dimmed" size="sm">
                                            {t("folderPickHint")}
                                        </Text>
                                    </Stack>
                                ) : (
                                    <>
                                        <SimpleGrid
                                            cols={{ base: 1, sm: 2 }}
                                            spacing="md"
                                        >
                                            <Stack gap={6}>
                                                <Text fw={600} size="sm">
                                                    {t("followersFilesLabel")}
                                                </Text>
                                                <input
                                                    ref={followersInputRef}
                                                    type="file"
                                                    multiple
                                                    accept=".json,application/json"
                                                    onChange={() => {
                                                        if (
                                                            followersInputRef
                                                                .current?.files
                                                                ?.length
                                                        )
                                                            onPickModeChange(
                                                                "files"
                                                            );
                                                    }}
                                                />
                                            </Stack>
                                            <Stack gap={6}>
                                                <Text fw={600} size="sm">
                                                    {t("followingFileLabel")}
                                                </Text>
                                                <input
                                                    ref={followingInputRef}
                                                    type="file"
                                                    accept=".json,application/json"
                                                    onChange={() => {
                                                        if (
                                                            followingInputRef
                                                                .current?.files
                                                                ?.length
                                                        )
                                                            onPickModeChange(
                                                                "files"
                                                            );
                                                    }}
                                                />
                                            </Stack>
                                        </SimpleGrid>
                                    </>
                                )}

                                <Group
                                    justify="space-between"
                                    align="center"
                                    wrap="wrap"
                                    mt="sm"
                                >
                                    <Button
                                        loading={busy}
                                        onClick={onParse}
                                        leftSection={<IconBolt size={16} />}
                                        color="orange"
                                    >
                                        {t("parseComputeBtn")}
                                    </Button>

                                    <Badge
                                        color={
                                            status.kind === "red"
                                                ? "red"
                                                : status.kind === "green"
                                                ? "green"
                                                : "gray"
                                        }
                                    >
                                        {status.text || t("statusWaiting")}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Card>

                        <Card withBorder radius="lg" p="lg">
                            <Stack gap="md">
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                    wrap="wrap"
                                    gap="md"
                                >
                                    <Stack
                                        gap={8}
                                        style={{ flex: 1, minWidth: 260 }}
                                    >
                                        <Title order={4}>
                                            {t("resultsTitle")}
                                        </Title>
                                        <Paper withBorder radius="md" p="sm">
                                            {results ? (
                                                renderStats()
                                            ) : (
                                                <Text c="dimmed" size="sm">
                                                    {t("statusWaiting")}
                                                </Text>
                                            )}
                                        </Paper>
                                    </Stack>
                                </Group>

                                <SimpleGrid
                                    cols={{ base: 1, sm: 2 }}
                                    spacing="md"
                                >
                                    <Paper withBorder radius="md" p="sm">
                                        <Group
                                            justify="space-between"
                                            align="center"
                                            wrap="wrap"
                                            gap="sm"
                                        >
                                            <SegmentedControl
                                                value={viewMode}
                                                onChange={setViewMode}
                                                data={[
                                                    {
                                                        value: "cards",
                                                        label: t("modeCards"),
                                                    },
                                                    {
                                                        value: "raw",
                                                        label: t("modeRaw"),
                                                    },
                                                ]}
                                            />
                                            <Group gap="xs">
                                                <Button
                                                    variant="default"
                                                    disabled={!results}
                                                    onClick={onCopyList}
                                                    leftSection={
                                                        <IconCopy size={16} />
                                                    }
                                                >
                                                    {t("copyListBtn")} (
                                                    {activeList.length})
                                                </Button>
                                                <ActionIcon
                                                    variant="default"
                                                    disabled={!results}
                                                    onClick={onDownloadActive}
                                                >
                                                    <IconDownload size={18} />
                                                </ActionIcon>
                                            </Group>
                                            <Group
                                                gap="xs"
                                                style={{ marginTop: 8 }}
                                            >
                                                <Select
                                                    data={[
                                                        {
                                                            value: "original",
                                                            label: t(
                                                                "sortOriginal"
                                                            ),
                                                        },
                                                        {
                                                            value: "alpha-asc",
                                                            label: t(
                                                                "sortAlphaAsc"
                                                            ),
                                                        },
                                                        {
                                                            value: "alpha-desc",
                                                            label: t(
                                                                "sortAlphaDesc"
                                                            ),
                                                        },
                                                        {
                                                            value: "date-asc",
                                                            label: t(
                                                                "sortDateAsc"
                                                            ),
                                                        },
                                                        {
                                                            value: "date-desc",
                                                            label: t(
                                                                "sortDateDesc"
                                                            ),
                                                        },
                                                    ]}
                                                    value={sortMode}
                                                    onChange={(v) =>
                                                        setSortMode(
                                                            v || "original"
                                                        )
                                                    }
                                                    w={200}
                                                    label={t("sortLabel")}
                                                />

                                                <TextInput
                                                    placeholder={t(
                                                        "searchPlaceholder"
                                                    )}
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value
                                                        )
                                                    }
                                                    w={200}
                                                />

                                                <Checkbox
                                                    label={t("onlyWithDate")}
                                                    checked={onlyWithDate}
                                                    onChange={(e) =>
                                                        setOnlyWithDate(
                                                            e.currentTarget
                                                                .checked
                                                        )
                                                    }
                                                />
                                            </Group>
                                        </Group>
                                    </Paper>
                                    <Paper withBorder radius="md" p="sm">
                                        <Group gap="xs" wrap="wrap">
                                            {viewButtons.map((b) => {
                                                const isActive =
                                                    activeKey === b.key;
                                                const color = colorForListKey(
                                                    b.key
                                                );
                                                return (
                                                    <Button
                                                        key={b.key}
                                                        variant={
                                                            isActive
                                                                ? "filled"
                                                                : "light"
                                                        }
                                                        color={color}
                                                        onClick={() =>
                                                            setActiveKey(b.key)
                                                        }
                                                        disabled={!results}
                                                    >
                                                        <Group
                                                            spacing={8}
                                                            align="center"
                                                        >
                                                            <Text
                                                                size="sm"
                                                                style={
                                                                    isActive
                                                                        ? {
                                                                              color: "var(--mantine-color-white)",
                                                                              fontWeight: 600,
                                                                          }
                                                                        : undefined
                                                                }
                                                            >
                                                                {baseLabelForKey(
                                                                    t,
                                                                    b.key
                                                                )}
                                                            </Text>
                                                            <Badge
                                                                color={
                                                                    !isActive
                                                                        ? color
                                                                        : 'white'
                                                                }
                                                                sx={
                                                                    isActive
                                                                        ? {
                                                                              backgroundColor:
                                                                                  "var(--mantine-color-white)",
                                                                              color: `var(--mantine-color-${color}-6)`,
                                                                              fontWeight: 700,
                                                                          }
                                                                        : 'white'
                                                                }
                                                            >
                                                                {typeof b.count ===
                                                                "number"
                                                                    ? b.count
                                                                    : 0}
                                                            </Badge>
                                                        </Group>
                                                    </Button>
                                                );
                                            })}
                                        </Group>
                                    </Paper>
                                </SimpleGrid>

                                {viewMode === "raw" ? (
                                    <Textarea
                                        value={rawText}
                                        readOnly
                                        minRows={12}
                                        autosize
                                        placeholder={t("outputPlaceholder")}
                                        styles={{
                                            input: {
                                                direction: "ltr",
                                                fontFamily:
                                                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                            },
                                        }}
                                    />
                                ) : (
                                    <>
                                        {!results || !activeList.length ? (
                                            <Paper
                                                withBorder
                                                radius="md"
                                                p="md"
                                            >
                                                <Text c="dimmed">
                                                    {t("emptyList")}
                                                </Text>
                                            </Paper>
                                        ) : (
                                            <SimpleGrid
                                                cols={{ base: 1, sm: 2, md: 3 }}
                                                spacing="md"
                                            >
                                                {activeList.map((username) => (
                                                    <Card
                                                        key={normalizeUsername(
                                                            username
                                                        )}
                                                        withBorder
                                                        radius="lg"
                                                        p="md"
                                                    >
                                                        <Stack gap="sm">
                                                            <Text
                                                                ff="monospace"
                                                                size="sm"
                                                            >
                                                                {username}
                                                            </Text>

                                                            {activeKey ===
                                                            "mutuals" ? (
                                                                <Stack gap={2}>
                                                                    {(() => {
                                                                        const youFollowed =
                                                                            metaForUser(
                                                                                meta.following,
                                                                                username
                                                                            );
                                                                        const theyFollowed =
                                                                            metaForUser(
                                                                                meta.followers,
                                                                                username
                                                                            );
                                                                        const youSince =
                                                                            formatSince(
                                                                                youFollowed?.timestamp
                                                                            );
                                                                        const theySince =
                                                                            formatSince(
                                                                                theyFollowed?.timestamp
                                                                            );

                                                                        return (
                                                                            <>
                                                                                {youSince ? (
                                                                                    <Text
                                                                                        size="xs"
                                                                                        c="dimmed"
                                                                                    >
                                                                                        {t(
                                                                                            "youFollowedSince"
                                                                                        )}
                                                                                        :{" "}
                                                                                        {
                                                                                            youSince
                                                                                        }
                                                                                    </Text>
                                                                                ) : null}
                                                                                {theySince ? (
                                                                                    <Text
                                                                                        size="xs"
                                                                                        c="dimmed"
                                                                                    >
                                                                                        {t(
                                                                                            "theyFollowedSince"
                                                                                        )}
                                                                                        :{" "}
                                                                                        {
                                                                                            theySince
                                                                                        }
                                                                                    </Text>
                                                                                ) : null}
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </Stack>
                                                            ) : (
                                                                (() => {
                                                                    const source =
                                                                        activeKey ===
                                                                            "followers" ||
                                                                        activeKey ===
                                                                            "you_dont_follow_back"
                                                                            ? meta.followers
                                                                            : activeKey ===
                                                                              "pending"
                                                                            ? meta.pending
                                                                            : meta.following;
                                                                    const label =
                                                                        activeKey ===
                                                                            "followers" ||
                                                                        activeKey ===
                                                                            "you_dont_follow_back"
                                                                            ? t(
                                                                                  "theyFollowedSince"
                                                                              )
                                                                            : activeKey ===
                                                                              "pending"
                                                                            ? t(
                                                                                  "requestedSince"
                                                                              )
                                                                            : t(
                                                                                  "youFollowedSince"
                                                                              );
                                                                    const since =
                                                                        formatSince(
                                                                            metaForUser(
                                                                                source,
                                                                                username
                                                                            )
                                                                                ?.timestamp
                                                                        );
                                                                    return since ? (
                                                                        <Text
                                                                            size="xs"
                                                                            c="dimmed"
                                                                        >
                                                                            {
                                                                                label
                                                                            }
                                                                            :{" "}
                                                                            {
                                                                                since
                                                                            }
                                                                        </Text>
                                                                    ) : null;
                                                                })()
                                                            )}

                                                            <Group
                                                                gap="sm"
                                                                wrap="wrap"
                                                            >
                                                                <Button
                                                                    component="a"
                                                                    href={instagramProfileUrl(
                                                                        username
                                                                    )}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    variant="light"
                                                                    leftSection={
                                                                        <IconExternalLink
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    {t(
                                                                        "visitProfile"
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    variant="default"
                                                                    leftSection={
                                                                        <IconCopy
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    }
                                                                    onClick={async () => {
                                                                        await copyToClipboard(
                                                                            username
                                                                        );
                                                                        setStatusText(
                                                                            t(
                                                                                "copied"
                                                                            ),
                                                                            "green"
                                                                        );
                                                                        window.setTimeout(
                                                                            () =>
                                                                                setStatusText(
                                                                                    results
                                                                                        ? t(
                                                                                              "statusDone"
                                                                                          )
                                                                                        : t(
                                                                                              "statusWaiting"
                                                                                          ),
                                                                                    "dimmed"
                                                                                ),
                                                                            900
                                                                        );
                                                                    }}
                                                                >
                                                                    {t("copy")}
                                                                </Button>
                                                            </Group>
                                                        </Stack>
                                                    </Card>
                                                ))}
                                            </SimpleGrid>
                                        )}
                                    </>
                                )}

                                <Text c="dimmed" size="sm">
                                    {t("tipNode")}
                                </Text>
                            </Stack>
                        </Card>
                    </Stack>
                </Container>
                )}
            </DirectionProvider>
        </MantineProvider>
    );
}
