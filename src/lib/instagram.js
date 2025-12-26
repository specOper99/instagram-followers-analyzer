const USERNAME_RE = /^[A-Za-z0-9._]{1,30}$/;

export function normalizeUsername(username) {
  if (typeof username !== 'string') return '';
  return username.trim().toLowerCase();
}

export function dedupePreserveOrderBy(items, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function usernameFromHref(href) {
  if (typeof href !== 'string') return null;
  try {
    const url = new URL(href);
    const parts = url.pathname.split('/').filter(Boolean);
    if (!parts.length) return null;
    const last = parts[parts.length - 1];
    return USERNAME_RE.test(last) ? last : null;
  } catch {
    const m = href.match(/instagram\.com\/(?:_u\/)?([A-Za-z0-9._]{1,30})(?:[/?#]|$)/i);
    return m ? m[1] : null;
  }
}

function maybePushUsername(found, username) {
  if (typeof username !== 'string') return;
  const trimmed = username.trim();
  if (!trimmed) return;
  if (USERNAME_RE.test(trimmed)) found.push(trimmed);
}

function normalizeTimestamp(ts) {
  if (typeof ts !== 'number') return null;
  if (!Number.isFinite(ts) || ts <= 0) return null;
  return ts;
}

function mergeMeta(existing, next) {
  if (!existing) return next;

  const aTs = normalizeTimestamp(existing.timestamp);
  const bTs = normalizeTimestamp(next.timestamp);

  let timestamp = aTs;
  if (aTs == null) timestamp = bTs;
  else if (bTs != null) timestamp = Math.min(aTs, bTs);

  return {
    username: existing.username || next.username,
    href: existing.href || next.href,
    timestamp,
    raw: existing.raw || next.raw || null,
  };
}

function toMetaMap(entries) {
  const metaByNorm = Object.create(null);
  const users = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    const username = typeof entry.username === 'string' ? entry.username.trim() : '';
    const norm = normalizeUsername(username);
    if (!norm) continue;

    users.push(username);

    const next = {
      username,
      href: typeof entry.href === 'string' ? entry.href : null,
      timestamp: normalizeTimestamp(entry.timestamp),
    };
    metaByNorm[norm] = mergeMeta(metaByNorm[norm], next);
  }

  const dedupedUsers = dedupePreserveOrderBy(users, normalizeUsername);
  return { users: dedupedUsers, metaByNorm };
}

export function extractEntriesFromJson(obj) {
  const entries = [];

  function walk(node) {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const v of node) walk(v);
      return;
    }

    if (typeof node !== 'object') return;

    const baseTitle = typeof node.title === 'string' ? node.title.trim() : '';
    const baseHref = typeof node.href === 'string' ? node.href : null;

    const sld = node.string_list_data;
    if (Array.isArray(sld)) {
      for (const item of sld) {
        if (!item || typeof item !== 'object') continue;
        const href = typeof item.href === 'string' ? item.href : baseHref;
        const fromHref = href ? usernameFromHref(href) : null;
        const username =
          (typeof item.value === 'string' && item.value.trim()) ||
          baseTitle ||
          (typeof fromHref === 'string' ? fromHref : '');

        if (typeof username === 'string' && USERNAME_RE.test(username.trim())) {
          entries.push({
            username: username.trim(),
            href: href || null,
            timestamp: normalizeTimestamp(item.timestamp),
          });
        }
      }
    }

    // Fallback if we see title/href without string_list_data timestamps.
    if (!Array.isArray(sld)) {
      const fromHref = baseHref ? usernameFromHref(baseHref) : null;
      const username = baseTitle || (typeof fromHref === 'string' ? fromHref : '');
      if (typeof username === 'string' && USERNAME_RE.test(username.trim())) {
        entries.push({ username: username.trim(), href: baseHref, timestamp: null });
      }
    }

    for (const k of Object.keys(node)) walk(node[k]);
  }

  walk(obj);
  return entries;
}

export function extractUsernamesFromJson(obj) {
  const found = [];

  function walk(node) {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const v of node) walk(v);
      return;
    }

    if (typeof node === 'object') {
      if (typeof node.title === 'string') {
        maybePushUsername(found, node.title);
      }

      if (typeof node.href === 'string') {
        const u = usernameFromHref(node.href);
        if (u) maybePushUsername(found, u);
      }

      const sld = node.string_list_data;
      if (Array.isArray(sld)) {
        for (const item of sld) {
          if (item && typeof item === 'object' && typeof item.value === 'string') {
            maybePushUsername(found, item.value);
          }
          if (item && typeof item === 'object' && typeof item.href === 'string') {
            const u = usernameFromHref(item.href);
            if (u) maybePushUsername(found, u);
          }
        }
      }

      for (const k of Object.keys(node)) walk(node[k]);
    }
  }

  walk(obj);
  return dedupePreserveOrderBy(found, normalizeUsername);
}

export async function readJsonFile(file) {
  const text = await file.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const err = new Error('PARSE_JSON');
    err.fileName = file?.name;
    throw err;
  }

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const keys = [
      'relationships_followers',
      'relationships_following',
      'relationships_follow_requests_sent',
      'relationships_follow_requests_received',
    ];
    for (const key of keys) {
      if (key in data) {
        return extractUsernamesFromJson(data[key]);
      }
    }
  }

  return extractUsernamesFromJson(data);
}

export async function readJsonFileWithMeta(file) {
  const text = await file.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const err = new Error('PARSE_JSON');
    err.fileName = file?.name;
    throw err;
  }

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const keys = [
      'relationships_followers',
      'relationships_following',
      'relationships_follow_requests_sent',
      'relationships_follow_requests_received',
    ];
    for (const key of keys) {
      if (key in data) {
        const entries = extractEntriesFromJson(data[key]);
        return toMetaMap(entries);
      }
    }

    // Fallback: some older exports include a pending_follow_requests.json structure
    if (data && typeof data === 'object' && 'pending_follow_requests' in data) {
      const entries = extractEntriesFromJson(data['pending_follow_requests']);
      return toMetaMap(entries);
    }
  }

  const entries = extractEntriesFromJson(data);
  return toMetaMap(entries);
}

function normalizeRelPath(file) {
  return String(file?.webkitRelativePath || file?.name || '').replace(/\\/g, '/');
}

function isJsonFileName(name) {
  return typeof name === 'string' && name.toLowerCase().endsWith('.json');
}

function inFollowersAndFollowingFolder(relPath) {
  const rel = String(relPath || '').toLowerCase();
  return rel.includes('/followers_and_following/') || rel.includes('followers_and_following/');
}

function scoreCandidate(relPath) {
  // Prefer the real export folder, but still work if user selects only files.
  let score = 0;
  if (inFollowersAndFollowingFolder(relPath)) score += 50;
  if (String(relPath || '').toLowerCase().includes('connections/')) score += 5;
  return score;
}

function isFollowersFileNameStrict(name) {
  if (typeof name !== 'string') return false;
  return /^followers(?:_\d+)?\.json$/i.test(name);
}

function isFollowingFileNameStrict(name) {
  if (typeof name !== 'string') return false;
  return /^following(?:_\d+)?\.json$/i.test(name);
}

function isPendingFileNameStrict(name) {
  if (typeof name !== 'string') return false;
  return /^pending_follow_requests(?:_\d+)?\.json$/i.test(name);
}

function pickFollowingFile(candidates) {
  if (!candidates.length) return null;

  // Prefer following.json, then following_1.json, then best score.
  const exact = candidates.find((c) => c.name.toLowerCase() === 'following.json');
  if (exact) return exact.file;
  const alt = candidates.find((c) => c.name.toLowerCase() === 'following_1.json');
  if (alt) return alt.file;

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
  return candidates[0].file;
}

/**
 * Robust file picker.
 * - Works with folder selection (any level: export root, connections/, followers_and_following/)
 * - Works with mixed manual selections (auto-separates following.json if user selected it in the wrong input)
 */
export function pickExportFilesFromAnySelection(filesLike) {
  const files = Array.from(filesLike || []).filter(Boolean);

  // De-dupe by relative path + size to avoid double-counting when user selects folder + also selects files.
  const seen = new Set();
  const items = [];
  for (const file of files) {
    const rel = normalizeRelPath(file);
    const key = `${rel}::${file.size}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      file,
      rel,
      name: file.name,
      lowerName: String(file.name || '').toLowerCase(),
      score: scoreCandidate(rel),
    });
  }

  // If the selection contains the exact export folder, prefer candidates from there.
  const inExportFolder = items.filter((x) => inFollowersAndFollowingFolder(x.rel));
  const pool = inExportFolder.length ? inExportFolder : items;

  const jsonPool = pool.filter((x) => isJsonFileName(x.name));

  // Strict matches first.
  let followersCandidates = jsonPool.filter((x) => isFollowersFileNameStrict(x.name));
  let followingCandidates = jsonPool.filter((x) => isFollowingFileNameStrict(x.name));

  // Fallback heuristics (older exports / odd names).
  if (!followersCandidates.length) {
    followersCandidates = jsonPool.filter(
      (x) => x.lowerName.includes('followers') && !x.lowerName.includes('following'),
    );
  }
  if (!followingCandidates.length) {
    followingCandidates = jsonPool
      .filter((x) => x.lowerName.includes('following'))
      .filter((x) => !x.lowerName.includes('hashtag'));
  }

  const followingFile = pickFollowingFile(followingCandidates);
  const followersFiles = followersCandidates
    .filter((x) => x.file !== followingFile)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    })
    .map((x) => x.file);

  // Pending follow requests (optional)
  let pendingCandidates = jsonPool.filter((x) => isPendingFileNameStrict(x.name));
  if (!pendingCandidates.length) {
    pendingCandidates = jsonPool.filter((x) => x.lowerName.includes('pending') || x.lowerName.includes('follow_request'));
  }
  const pendingFiles = pendingCandidates
    .filter((x) => !followersFiles.includes(x.file) && x.file !== followingFile)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    })
    .map((x) => x.file);

  return { followersFiles, followingFile, pendingFiles };
}

export function pickFilesFromFolderInput(fileList) {
  return pickExportFilesFromAnySelection(fileList);
}

function toUniqueNormalizedList(items) {
  const canonByNorm = new Map();
  const norms = [];
  for (const item of items) {
    const norm = normalizeUsername(item);
    if (!norm) continue;
    if (canonByNorm.has(norm)) continue;
    canonByNorm.set(norm, item);
    norms.push(norm);
  }
  return { norms, canonByNorm };
}

function projectNorms(norms, canonByNorm) {
  return norms.map((n) => canonByNorm.get(n) || n);
}

export function computeLists(followers, following, pending) {
  const followersInfo = toUniqueNormalizedList(followers);
  const followingInfo = toUniqueNormalizedList(following);
  const pendingInfo = toUniqueNormalizedList(pending || []);

  const followersSet = new Set(followersInfo.norms);
  const followingSet = new Set(followingInfo.norms);

  const notFollowingBackNorms = followingInfo.norms.filter((n) => !followersSet.has(n));
  const youDontFollowBackNorms = followersInfo.norms.filter((n) => !followingSet.has(n));
  const mutualsNorms = followingInfo.norms.filter((n) => followersSet.has(n));

  return {
    followers: projectNorms(followersInfo.norms, followersInfo.canonByNorm),
    following: projectNorms(followingInfo.norms, followingInfo.canonByNorm),
    pending: projectNorms(pendingInfo.norms, pendingInfo.canonByNorm),
    not_following_back: projectNorms(notFollowingBackNorms, followingInfo.canonByNorm),
    you_dont_follow_back: projectNorms(youDontFollowBackNorms, followersInfo.canonByNorm),
    mutuals: projectNorms(mutualsNorms, followingInfo.canonByNorm),
  };
}

export function instagramProfileUrl(username) {
  const u = (username || '').trim();
  return `https://www.instagram.com/${encodeURIComponent(u)}/`;
}
