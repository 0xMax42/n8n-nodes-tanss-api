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
	/**
	 * Some endpoints require the (employee) ID to be present
	 * both in the path as well as in the body of the request.
	 * This is rather unusual and likely an error in the API design.
	 * Therefore, the behaviour can be switched using this constant.
	 */
	requiresIdInPathAndBody: false,
} as const;
