"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { useCurrentUser } from "@/features/auth";
import { useCart } from "@/features/cart";
import { useAddresses } from "@/features/addresses";
import { useCheckoutSummaryQuery } from "@/features/checkout";
import { useCreateOrderMutation } from "@/features/orders";
import { CheckoutProgressBar } from "./checkout-progress-bar";
import { CheckoutBillingForm } from "./checkout-billing-form";
import { CheckoutShippingForm } from "./checkout-shipping-form";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutOrderConfirmed } from "./checkout-order-confirmed";
import { CheckoutLoadingState } from "./checkout-loading-state";
import { CheckoutEmptyState } from "./checkout-empty-state";
import { AddressModalForm } from "./address-modal-form";
import { useCheckoutPromo } from "./use-checkout-promo";
import { useCheckoutAddressSelection } from "./use-checkout-address-selection";
import { useCheckoutPricing } from "./use-checkout-pricing";
import { useCheckoutOrderFlow } from "./use-checkout-order-flow";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { items, summary, isLoading: isCartLoading } = useCart();
  const {
    addresses,
    defaultAddress,
    isLoading: isAddressesLoading,
    isMutating,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
  } = useAddresses();

  const createOrderMutation = useCreateOrderMutation();

  const {
    selectedBillingId,
    selectedShippingId,
    selectedBillingAddress,
    selectedShippingAddress,
    sameAsBilling,
    setSameAsBilling,
    handleSelectBillingAddress,
    handleSelectShippingAddress,
    isAddressModalOpen,
    setIsAddressModalOpen,
    addressToEdit,
    modalAddressType,
    handleOpenAddModal,
    handleEditAddress,
    handleAddressSubmit,
  } = useCheckoutAddressSelection({
    addresses,
    defaultAddress,
    setDefaultAddress,
    createAddress,
    updateAddress,
  });

  const {
    couponInput,
    setCouponInput,
    appliedCouponCode,
    handleApplyPromo,
    handleRemovePromo,
  } = useCheckoutPromo();

  const { data: summaryResponse } = useCheckoutSummaryQuery(
    {
      shippingAddressId: selectedShippingId || undefined,
      billingAddressId: selectedBillingId || undefined,
      billingSameAsShipping: sameAsBilling ? "true" : "false",
      couponCode: appliedCouponCode || undefined,
    },
    { enabled: items.length > 0 },
  );

  const checkoutSummary = summaryResponse?.data;

  const {
    activeItems,
    activeSubtotal,
    activeTotalMrp,
    activeMrpSavings,
    activeCouponDiscount,
    activeDeliveryCharge,
    canCheckout,
    checkoutIssues,
    captureSnapshot,
  } = useCheckoutPricing({
    checkoutSummary,
    summary,
    items,
    isOrderComplete: false,
    isPlacingOrder: false,
  });

  const {
    paymentMethod,
    setPaymentMethod,
    acceptedTerms,
    setAcceptedTerms,
    isOrderComplete,
    setIsOrderComplete,
    orderNumber,
    isPlacingOrder,
    handleProceedToPayment,
  } = useCheckoutOrderFlow({
    user,
    activeItems,
    selectedBillingAddress,
    selectedShippingAddress,
    selectedBillingId,
    selectedShippingId,
    sameAsBilling,
    appliedCouponCode,
    canCheckout,
    checkoutIssues,
    captureSnapshot,
    handleOpenAddModal,
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
  });

  const isInitialLoading =
    (isCartLoading || isUserLoading || isAddressesLoading) &&
    !isPlacingOrder &&
    !isOrderComplete &&
    activeItems.length === 0;

  if (isInitialLoading) {
    return <CheckoutLoadingState />;
  }

  if (
    items.length === 0 &&
    !isOrderComplete &&
    !isPlacingOrder &&
    activeItems.length === 0
  ) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <CategoryBanner categoryName="Checkout" compact />

      <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CheckoutProgressBar />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
              <CheckoutBillingForm
                addresses={addresses}
                selectedAddressId={selectedBillingId}
                onSelectAddress={handleSelectBillingAddress}
                onOpenAddModal={() => handleOpenAddModal("BILLING")}
                onEditAddress={handleEditAddress}
                onDeleteAddress={deleteAddress}
                onSetDefaultAddress={setDefaultAddress}
                sameAsBilling={sameAsBilling}
                onSameAsBillingChange={setSameAsBilling}
              />

              <CheckoutShippingForm
                selectedBillingAddress={selectedBillingAddress}
                addresses={addresses}
                selectedShippingAddressId={selectedShippingId}
                onSelectShippingAddress={handleSelectShippingAddress}
                onOpenAddModal={() => handleOpenAddModal("SHIPPING")}
                onEditAddress={handleEditAddress}
                onDeleteAddress={deleteAddress}
                onSetDefaultAddress={setDefaultAddress}
                sameAsBilling={sameAsBilling}
                onSetSameAsBilling={setSameAsBilling}
              />
            </div>

            <div className="lg:col-span-4">
              <CheckoutOrderSummary
                items={activeItems}
                subtotal={activeSubtotal}
                totalMrp={activeTotalMrp}
                mrpSavings={activeMrpSavings}
                couponCode={couponInput}
                onCouponCodeChange={setCouponInput}
                appliedCoupon={appliedCouponCode}
                couponDiscount={activeCouponDiscount}
                couponMessage={checkoutSummary?.coupon?.message}
                isCouponValid={checkoutSummary?.coupon?.isValid ?? true}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                availablePaymentMethods={checkoutSummary?.paymentMethods}
                acceptedTerms={acceptedTerms}
                onAcceptedTermsChange={setAcceptedTerms}
                isProcessing={isPlacingOrder || createOrderMutation.isPending}
                canCheckout={canCheckout}
                checkoutIssues={checkoutIssues}
                deliveryCharge={activeDeliveryCharge}
                deliveryDays={
                  checkoutSummary?.delivery
                    ? {
                      min: checkoutSummary.delivery.estimatedMinDays,
                      max: checkoutSummary.delivery.estimatedMaxDays,
                    }
                    : undefined
                }
                onProceed={handleProceedToPayment}
              />
            </div>
          </div>
        </div>
      </main>

      <AddressModalForm
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addressToEdit={addressToEdit}
        defaultType={modalAddressType}
        initialUser={
          user
            ? {
              name: user.name,
              email: user.email,
              mobileNumber: user.mobileNumber,
            }
            : null
        }
        onSubmit={handleAddressSubmit}
        isSubmitting={isMutating}
      />

      <CheckoutOrderConfirmed
        isOpen={isOrderComplete}
        onClose={() => {
          setIsOrderComplete(false);
          router.replace("/orders");
        }}
        orderNumber={orderNumber}
      />
    </div>
  );
}

export { CheckoutPage };