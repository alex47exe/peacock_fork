/*
 *     The Peacock Project - a HITMAN server replacement.
 *     Copyright (C) 2021-2023 The Peacock Project Team
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { ContractSession } from "./types/types"

/**
 * Changes a set to an array.
 *
 * @param set The set.
 */
export function normalizeSet<T>(set: Set<T>): T[] {
    const l: T[] = []

    set.forEach((i) => l.push(i))

    return l
}

const SESSION_SET_PROPS: (keyof ContractSession)[] = [
    "targetKills",
    "npcKills",
    "bodiesHidden",
    "pacifications",
    "disguisesUsed",
    "disguisesRuined",
    "spottedBy",
    "witnesses",
    "bodiesFoundBy",
    "killsNoticedBy",
    "completedObjectives",
    "kills",
    "markedTargets",
    "failedObjectives",
]

const SESSION_MAP_PROPS: (keyof ContractSession)[] = [
    "objectiveStates",
    "objectiveContexts",
    "objectiveDefinitions",
]

/**
 * Prepares a contract session for saving to a file.
 *
 * @param session The ContractSession.
 */
export function serializeSession(session: ContractSession): unknown {
    const o = {}

    // obj clone
    for (const key of Object.keys(session)) {
        if (session[key] instanceof Map) {
            o[key] = Array.from(
                (session[key] as Map<string, unknown>).entries(),
            )
            continue
        }

        if (session[key] instanceof Set) {
            o[key] = normalizeSet(session[key])
            continue
        }

        o[key] = session[key]
    }

    return o
}

/**
 * Changes all ContractSession array items into sets.
 *
 * @param saved The ContractSession.
 */
export function deserializeSession(
    saved: Record<string, unknown>,
): ContractSession {
    const session = {}

    // obj clone
    for (const key of Object.keys(saved)) {
        session[key] = saved[key]
    }

    for (const collection of SESSION_SET_PROPS) {
        session[collection] = new Set(session[collection])
    }

    for (const map of SESSION_MAP_PROPS) {
        if (Object.hasOwn(session, map)) {
            session[map] = new Map(session[map])
        }
    }

    return <ContractSession>session
}
