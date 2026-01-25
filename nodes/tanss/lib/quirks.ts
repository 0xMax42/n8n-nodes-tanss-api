/**
 * A collection of quirks to handle non-standard API behaviours
 * from TANSS.
 */
export const ApiQuirks = {
	/**
	 * The OpenAPI description states that for most `Create` endpoints,
	 * the ID **must** be sent along with the request.
	 * From any reasonable perspective, this appears to be an error in the specification.
	 * Therefore, the behaviour can be switched using this constant.
	 */
	requiresIdOnCreate: false,
} as const;
